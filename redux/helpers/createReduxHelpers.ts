import { ExtractDocType, Model, ModelConstructor, ModelInstance } from "@stantanasi/jsonapi-client";
import { AppThunk, slices } from "../store";

type Unpacked<T> = T extends (infer U)[] ? U : T;

type Relationships<DocType> = Extract<{
  [K in keyof DocType]: ExtractDocType<DocType[K]> extends never ? never : K;
}[keyof DocType], string>;

export type ReduxHelpers<DocType, ModelType extends ModelConstructor<DocType>> = {
  redux: {
    name: keyof typeof slices;

    actions: {
      setOne: (doc: InstanceType<ModelType>) => AppThunk;

      setMany: (docs: InstanceType<ModelType>[]) => AppThunk;

      removeOne: (doc: InstanceType<ModelType>) => AppThunk;

      removeMany: (docs: InstanceType<ModelType>[]) => AppThunk;

      relations: {
        [K in Relationships<DocType>]: {
          add: (
            id: string,
            related: NonNullable<Unpacked<DocType[K]>>,
          ) => AppThunk;

          remove: (
            id: string,
            related: NonNullable<Unpacked<DocType[K]>>,
          ) => AppThunk;

          set: (
            id: string,
            related: NonNullable<DocType[K]>,
          ) => AppThunk;
        };
      };
    };
  };
}

export const createReduxHelpers = <DocType, ModelType extends ModelConstructor<DocType>>(
  model: ModelType,
) => {
  return {
    register: (name: keyof typeof slices): ReduxHelpers<DocType, ModelType>['redux'] => {
      const slice = slices[name];
      const relationships = Object.keys(model.schema.relationships) as Relationships<DocType>[];

      return {
        name: name,

        actions: {
          setOne: (doc) => (dispatch) => {
            for (const relationship of relationships) {
              const value = doc[relationship] as ModelInstance<unknown> | ModelInstance<unknown>[] | undefined;

              if (Array.isArray(value)) {
                for (const val of value) {
                  const relatedModel = val.model() as ModelConstructor<unknown> & ReduxHelpers<unknown, ModelConstructor<unknown>>;
                  if (!relatedModel.redux) continue

                  dispatch(relatedModel.redux.actions.setOne(val));
                }
              } else if (value) {
                const relatedModel = value.model() as ModelConstructor<unknown> & ReduxHelpers<unknown, ModelConstructor<unknown>>;
                if (!relatedModel.redux) continue

                dispatch(relatedModel.redux.actions.setOne(value));
              }
            }

            dispatch(slice.actions.setOne(doc.toJSON() as any));
          },

          setMany: (docs) => (dispatch) => {
            for (const doc of docs) {
              for (const relationship of relationships) {
                const value = doc[relationship] as ModelInstance<unknown> | ModelInstance<unknown>[] | undefined;

                if (Array.isArray(value)) {
                  for (const val of value) {
                    const relatedModel = val.model() as ModelConstructor<unknown> & ReduxHelpers<unknown, ModelConstructor<unknown>>;
                    if (!relatedModel.redux) continue

                    dispatch(relatedModel.redux.actions.setOne(val));
                  }
                } else if (value) {
                  const relatedModel = value.model() as ModelConstructor<unknown> & ReduxHelpers<unknown, ModelConstructor<unknown>>;
                  if (!relatedModel.redux) continue

                  dispatch(relatedModel.redux.actions.setOne(value));
                }
              }

              dispatch(slice.actions.setOne(doc.toJSON() as any));
            }
          },

          removeOne: (doc) => (dispatch) => {
            dispatch(slice.actions.removeOne(doc.id));
          },

          removeMany: (docs) => (dispatch) => {
            for (const doc of docs) {
              dispatch(slice.actions.removeOne(doc.id));
            }
          },

          relations: {
            ...relationships.reduce((acc, relationship) => {
              acc[relationship] = {
                add: (id, related) => (dispatch) => {
                  if (!(related instanceof Model)) return

                  dispatch(
                    slice.actions.addRelation({
                      id: id,
                      relationship: relationship,
                      data: related.identifier(),
                    })
                  );
                },

                remove: (id, related) => (dispatch) => {
                  if (!(related instanceof Model)) return

                  dispatch(
                    slice.actions.removeRelation({
                      id: id,
                      relationship: relationship,
                      data: related.identifier(),
                    })
                  );
                },

                set: (id, related) => (dispatch) => {
                  const isModelOrModelArray = (value: unknown): value is Model<unknown> | Model<unknown>[] => {
                    const isModelArray = (value: unknown): value is Model<unknown>[] => {
                      return Array.isArray(value) && value.every(item => item instanceof Model);
                    };

                    return value instanceof Model || isModelArray(value);
                  }

                  if (!isModelOrModelArray(related)) return

                  dispatch(
                    slice.actions.setRelation({
                      id: id,
                      relationship: relationship,
                      data: Array.isArray(related)
                        ? related.map((m) => m.identifier())
                        : related.identifier(),
                    })
                  );
                },
              };
              return acc;
            }, {} as ReduxHelpers<DocType, ModelType>['redux']['actions']['relations']),
          },
        },
      };
    },
  };
};

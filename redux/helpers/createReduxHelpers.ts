import { createSelector } from "@reduxjs/toolkit";
import { ExtractDocType, JsonApiIdentifier, Model, ModelConstructor, ModelInstance, models } from "@stantanasi/jsonapi-client";
import { AppThunk, RootState, slices } from "../store";

type Relationships<DocType> = Extract<{
  [K in keyof DocType]: ExtractDocType<DocType[K]> extends never ? never : K;
}[keyof DocType], string>;

type SelectorParams<DocType> = {
  filter?: {
    [K in keyof DocType]?: DocType[K];
  };
  include?: {
    [K in Relationships<DocType>]?: SelectorParams<ExtractDocType<DocType[K]>> | boolean;
  } & {
    [key: string]: SelectorParams<unknown> | boolean;
  };
  sort?: {
    [K in keyof DocType]?: -1 | 1 | 'asc' | 'ascending' | 'desc' | 'descending';
  } & {
    [key: string]: -1 | 1 | 'asc' | 'ascending' | 'desc' | 'descending';
  };
  limit?: number;
  offset?: number;
}


const fromEntity = <DocType, M extends ModelConstructor<DocType>>(
  name: keyof typeof slices,
  model: M,
  state: RootState,
  id: string,
  entity: typeof state[keyof typeof state]['entities'][keyof typeof state[keyof typeof state]['entities']],
  params?: SelectorParams<DocType>,
): InstanceType<M> | undefined => {
  if (!entity) return entity;

  if (params?.filter) {
    for (const [key, expected] of Object.entries(params.filter)) {
      const actual = entity[key as keyof typeof entity];

      if (Object.hasOwn(entity, key)) {
        const isEqual = JSON.stringify(actual) === JSON.stringify(expected);
        if (!isEqual) return undefined;
        continue;
      }

      if (Object.hasOwn(state[name].relations, key)) {
        const linked = state[name].relations[key]?.[id];

        const expectedIdentifier = expected instanceof Model
          ? expected.identifier()
          : expected;

        const isEqual = JSON.stringify(linked) === JSON.stringify(expectedIdentifier);
        if (!isEqual) return undefined;
      }
    }
  }

  const relations: Record<string, ModelInstance<unknown> | ModelInstance<unknown>[] | undefined> = {};
  for (const relationship of Object.keys(params?.include ?? {})) {
    if (!params?.include?.[relationship]) continue

    const relatedParams = typeof params.include[relationship] === 'object'
      ? params.include[relationship]
      : undefined;

    const linkage = state[name].relations[relationship]?.[id];

    if (Array.isArray(linkage)) {
      let relatedDocs = linkage
        .map((identifier) => {
          const relatedModel = models[identifier.type] as ModelConstructor<unknown> & ReduxHelpers<unknown, ModelConstructor<unknown>>;

          return fromEntity(
            relatedModel.redux.name,
            relatedModel,
            state,
            identifier.id,
            state[relatedModel.redux.name].entities[identifier.id],
            relatedParams,
          );
        })
        .filter((doc) => !!doc);

      if (relatedParams?.sort) {
        const sort = Object.entries(relatedParams.sort);
        relatedDocs.sort((a, b) => {
          for (const [path, order] of sort) {
            const aValue = a[path as keyof typeof a];
            const bValue = b[path as keyof typeof b];

            if (aValue < bValue) {
              return order === -1 || order === 'desc' || order === 'descending' ? 1 : -1;
            }
            if (aValue > bValue) {
              return order === -1 || order === 'desc' || order === 'descending' ? -1 : 1;
            }
          }
          return 0;
        });
      }

      if (relatedParams?.limit || relatedParams?.offset) {
        const start = relatedParams.offset ?? 0;
        const end = start + (relatedParams.limit ?? relatedDocs.length);
        relatedDocs = relatedDocs.slice(start, end);
      }

      relations[relationship] = relatedDocs;
    } else if (linkage) {
      const identifier = linkage;
      const relatedModel = models[identifier.type] as ModelConstructor<unknown> & ReduxHelpers<unknown, ModelConstructor<unknown>>;

      relations[relationship] = fromEntity(
        relatedModel.redux.name,
        relatedModel,
        state,
        identifier.id,
        state[relatedModel.redux.name].entities[identifier.id],
        relatedParams,
      );
    }
  }

  return new model({
    ...entity,
    ...relations,
  }, { isNew: false }) as InstanceType<M>;
};

const buildDocs = <DocType, M extends ModelConstructor<DocType>>(
  docs: InstanceType<M>[],
  params?: SelectorParams<DocType>
): InstanceType<M>[] => {
  if (!docs.length) return [];

  if (params?.sort) {
    const sort = Object.entries(params.sort);
    docs.sort((a, b) => {
      for (const [path, order] of sort) {
        const aValue = a[path as keyof typeof a];
        const bValue = b[path as keyof typeof b];

        if (aValue < bValue) {
          return order === -1 || order === 'desc' || order === 'descending' ? 1 : -1;
        }
        if (aValue > bValue) {
          return order === -1 || order === 'desc' || order === 'descending' ? -1 : 1;
        }
      }
      return 0;
    });
  }

  if (params?.limit || params?.offset) {
    const start = params.offset ?? 0;
    const end = start + (params.limit ?? docs.length);
    docs = docs.slice(start, end);
  }

  return docs;
};

const selectDocById = <DocType, M extends ModelConstructor<DocType>>(
  name: keyof typeof slices,
  model: M,
  state: RootState,
  id: string,
  entity: typeof state[keyof typeof state]['entities'][keyof typeof state[keyof typeof state]['entities']],
  params?: SelectorParams<DocType>,
): InstanceType<M> | undefined => {
  return fromEntity(
    name,
    model,
    state,
    id,
    entity,
    params,
  );
};

const selectDocByIds = <DocType, M extends ModelConstructor<DocType>>(
  name: keyof typeof slices,
  model: M,
  state: RootState,
  ids: string[],
  entities: typeof state[keyof typeof state]['entities'],
  params?: SelectorParams<DocType>,
): InstanceType<M>[] => {
  let docs = ids
    .map((id) => {
      const entity = entities[id];
      if (!entity) return entity;

      return fromEntity(
        name,
        model,
        state,
        id,
        entity,
        params,
      );
    })
    .filter((doc) => !!doc);

  return buildDocs(docs, params);
};

const selectDocs = <DocType, M extends ModelConstructor<DocType>>(
  name: keyof typeof slices,
  model: M,
  state: RootState,
  entities: typeof state[keyof typeof state]['entities'],
  params?: SelectorParams<DocType>,
): InstanceType<M>[] => {
  let docs = Object.values<typeof entities[keyof typeof entities]>(entities)
    .map((entity) => {
      const id = entity!.id;

      return fromEntity(
        name,
        model,
        state,
        id,
        entity,
        params,
      );
    })
    .filter((doc) => !!doc);

  return buildDocs(docs, params);
};

const selectRelation = <DocType, K extends Relationships<DocType>>(
  state: RootState,
  relationship: K,
  linkage: JsonApiIdentifier | JsonApiIdentifier[] | null | undefined,
  params?: SelectorParams<ExtractDocType<DocType[K]>>,
): DocType[K] | undefined => {
  if (Array.isArray(linkage)) {
    let docs = linkage
      .map((identifier) => {
        const relatedModel = models[identifier.type] as ModelConstructor<unknown> & ReduxHelpers<unknown, ModelConstructor<unknown>>;

        return fromEntity(
          relatedModel.redux.name,
          relatedModel as ModelConstructor<any>,
          state,
          identifier.id,
          state[relatedModel.redux.name].entities[identifier.id],
          params,
        );
      })
      .filter((doc) => !!doc);

    return buildDocs(docs, params) as DocType[typeof relationship];
  } else if (linkage) {
    const identifier = linkage;
    const relatedModel = models[identifier.type] as ModelConstructor<unknown> & ReduxHelpers<unknown, ModelConstructor<unknown>>;

    const doc = fromEntity(
      relatedModel.redux.name,
      relatedModel as ModelConstructor<any>,
      state,
      identifier.id,
      state[relatedModel.redux.name].entities[identifier.id],
      params,
    );

    return doc as DocType[typeof relationship];
  } else {
    return undefined;
  }
};

type ModelInstanceUnion<T> = T extends any ? ModelInstance<T> : never;


export type ReduxHelpers<DocType, ModelType extends ModelConstructor<DocType>> = {
  redux: {
    name: keyof typeof slices;

    actions: {
      setOne: (doc: InstanceType<ModelType>) => AppThunk;

      setMany: (docs: InstanceType<ModelType>[]) => AppThunk;

      saveOne: (doc: InstanceType<ModelType>) => AppThunk;

      removeOne: (doc: InstanceType<ModelType>) => AppThunk;

      removeMany: (docs: InstanceType<ModelType>[]) => AppThunk;

      relations: {
        [K in Relationships<DocType>]: {
          add: <T extends ModelInstance<ExtractDocType<DocType[K]>>> (
            id: string,
            related: T,
          ) => AppThunk;

          remove: <T extends ModelInstance<ExtractDocType<DocType[K]>>> (
            id: string,
            related: T,
          ) => AppThunk;

          set: <T extends (ModelInstanceUnion<ExtractDocType<DocType[K]>> | ModelInstanceUnion<ExtractDocType<DocType[K]>>[]) & NonNullable<DocType[K]>> (
            id: string,
            related: T,
          ) => AppThunk;
        };
      };
    };

    selectors: {
      selectById: (
        state: RootState,
        id: string,
        params?: SelectorParams<DocType>,
      ) => InstanceType<ModelType> | undefined;

      selectByIds: (
        state: RootState,
        ids: string[],
        params?: SelectorParams<DocType>,
      ) => InstanceType<ModelType>[];

      select: (
        state: RootState,
        params?: SelectorParams<DocType>,
      ) => InstanceType<ModelType>[];

      selectRelation: <K extends Relationships<DocType>> (
        state: RootState,
        id: string,
        relationship: K,
        params?: SelectorParams<ExtractDocType<DocType[K]>>,
      ) => DocType[K] | undefined;
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

          saveOne: (doc) => (dispatch) => {
            dispatch(slice.actions.setOne(doc.toJSON() as any));
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
                  dispatch(
                    slice.actions.addRelation({
                      id: id,
                      relationship: relationship,
                      data: related.identifier(),
                    })
                  );
                },

                remove: (id, related) => (dispatch) => {
                  dispatch(
                    slice.actions.removeRelation({
                      id: id,
                      relationship: relationship,
                      data: related.identifier(),
                    })
                  );
                },

                set: (id, related) => (dispatch) => {
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

        selectors: {
          selectById: createSelector([
            (state: RootState) => state,
            (state: RootState, id: string) => state[name].entities[id],
            (_state: RootState, id: string) => id,
            (_state: RootState, _id: string, params?: SelectorParams<DocType>) => params,
          ], (state, entity, id, params) => {
            return selectDocById(
              name,
              model,
              state,
              id,
              entity,
              params,
            );
          }),

          selectByIds: createSelector([
            (state: RootState) => state,
            (state: RootState) => state[name].entities,
            (_state: RootState, ids: string[]) => ids,
            (_state: RootState, _ids: string[], params?: SelectorParams<DocType>) => params,
          ], (state, entities, ids, params) => {
            return selectDocByIds(
              name,
              model,
              state,
              ids,
              entities,
              params,
            );
          }),

          select: createSelector([
            (state: RootState) => state,
            (state: RootState) => state[name].entities,
            (_state: RootState, params?: SelectorParams<DocType>) => params,
          ], (state, entities, params) => {
            return selectDocs(
              name,
              model,
              state,
              entities,
              params,
            );
          }),

          selectRelation: (<K extends Relationships<DocType>>() => createSelector([
            (state: RootState) => state,
            (state: RootState, id: string, relationship: K) => state[name].relations[relationship]?.[id],
            (_state: RootState, _id: string, relationship: K) => relationship,
            (_state: RootState, _id: string, _relationship: K, params?: SelectorParams<ExtractDocType<DocType[K]>>) => params,
          ], (state, linkage, relationship, params): DocType[typeof relationship] | undefined => {
            return selectRelation(
              state,
              relationship,
              linkage,
              params,
            ) as DocType[typeof relationship];
          }))(),
        },
      };
    },
  };
};

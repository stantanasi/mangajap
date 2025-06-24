import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import { ExtractDocType, Json, JsonApiIdentifier } from "@stantanasi/jsonapi-client";
import { State } from "../store";

type Relationships<DocType> = Extract<{
  [K in keyof DocType]: ExtractDocType<DocType[K]> extends never ? never : K;
}[keyof DocType], string>;

export const createModelSlice = <DocType extends Record<string, any>>(
  name: string,
  relationships: Relationships<DocType>[],
) => {
  const initialState: State<DocType> = {
    entities: {},
    relations: Object.fromEntries(relationships.map((relationship) => [relationship, {}])),
  };

  return createSlice({
    name: name,
    initialState: initialState,
    reducers: {
      setOne: (state, action: PayloadAction<Json<DocType>>) => {
        const doc = action.payload;

        for (const relationship of relationships) {
          const value = doc[relationship] as Json<unknown> | Json<unknown>[] | null | undefined;

          if (value !== undefined) {
            state.relations[relationship][doc.id] = Array.isArray(value)
              ? value.map((val) => ({ type: val.type, id: val.id }))
              : value
                ? { type: value.type, id: value.id }
                : value;
          }

          delete doc[relationship];
        }

        state.entities[doc.id] = doc as Draft<typeof action.payload>;
      },

      removeOne: (state, action: PayloadAction<string>) => {
        const id = action.payload;

        for (const relationship of relationships) {
          delete state.relations[relationship][id];
        }

        delete state.entities[id];
      },

      addRelation: (state, action: PayloadAction<{
        id: string;
        relationship: string,
        data: JsonApiIdentifier,
      }>) => {
        const { id, relationship, data } = action.payload;

        const existing = state.relations[relationship][id];

        if (Array.isArray(existing)) {
          const alreadyExists = existing.some((identifier) => {
            return identifier.type === data.type && identifier.id === data.id;
          });

          if (!alreadyExists) {
            state.relations[relationship][id] = [
              ...existing,
              data,
            ];
          }
        } else {
          state.relations[relationship][id] = [data];
        }
      },

      addManyRelation: (state, action: PayloadAction<{
        id: string;
        relationship: string,
        data: JsonApiIdentifier[],
      }>) => {
        const { id, relationship, data } = action.payload;

        const existing = state.relations[relationship][id];

        if (Array.isArray(existing)) {
          const newItems = data.filter((identifier) =>
            !existing.some((item) => item.type === identifier.type && item.id === identifier.id)
          );

          state.relations[relationship][id] = [...existing, ...newItems];
        } else {
          state.relations[relationship][id] = data;
        }
      },

      removeRelation: (state, action: PayloadAction<{
        id: string;
        relationship: string,
        data: JsonApiIdentifier,
      }>) => {
        const { id, relationship, data } = action.payload;

        const existing = state.relations[relationship][id];

        if (Array.isArray(existing)) {
          state.relations[relationship][id] = existing.filter((identifier) => {
            return !(identifier.type === data.type && identifier.id === data.id);
          });
        } else {
          delete state.relations[relationship][id];
        }
      },

      setRelation: (state, action: PayloadAction<{
        id: string;
        relationship: string,
        data: JsonApiIdentifier | JsonApiIdentifier[],
      }>) => {
        const { id, relationship, data } = action.payload;

        state.relations[relationship][id] = data;
      },
    },
  });
};

import { model, Schema } from "@stantanasi/jsonapi-client";

export interface IPeople {
  id: string;

  name: string;
  portrait: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const PeopleSchema = new Schema<IPeople>({
  attributes: {
    name: {},

    portrait: {},

    createdAt: {
      get: function (value: string) {
        return new Date(value);
      },
      transform: function (val) {
        return val.toISOString();
      },
    },

    updatedAt: {
      get: function (value: string) {
        return new Date(value);
      },
      transform: function (val) {
        return val.toISOString();
      },
    },
  },

  relationships: {
  },
});


export default class People extends model<IPeople>("peoples", PeopleSchema) { }

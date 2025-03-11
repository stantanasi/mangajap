import { model, Schema } from "@stantanasi/jsonapi-client";

export interface ITheme {
  id: string;

  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ThemeSchema = new Schema<ITheme>({
  attributes: {
    name: {},

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


export default class Theme extends model<ITheme>("themes", ThemeSchema) { }

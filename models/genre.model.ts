import { model, Schema } from "@stantanasi/jsonapi-client";

export interface IGenre {
  id: string;

  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export const GenreSchema = new Schema<IGenre>({
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


export default class Genre extends model<IGenre>("genres", GenreSchema) { }

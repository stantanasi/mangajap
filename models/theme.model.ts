import { model, Schema } from "@stantanasi/jsonapi-client";
import Anime from "./anime.model";
import Manga from "./manga.model";

export interface ITheme {
  id: string;

  name: string;
  createdAt: Date;
  updatedAt: Date;

  animes?: Anime[];
  mangas?: Manga[];
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
    animes: {},

    mangas: {},
  },
});


export default class Theme extends model<ITheme>("themes", ThemeSchema) { }

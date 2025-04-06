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
      type: Date,
    },

    updatedAt: {
      type: Date,
    },
  },

  relationships: {
    animes: {},

    mangas: {},
  },
});


class Theme extends model<ITheme>(ThemeSchema) { }

Theme.register("themes");

export default Theme;

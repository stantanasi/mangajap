import { model, Schema } from "@stantanasi/jsonapi-client";
import Anime from "./anime.model";
import Manga from "./manga.model";

export interface IGenre {
  id: string;

  name: string;
  createdAt: Date;
  updatedAt: Date;

  animes?: Anime[];
  mangas?: Manga[];
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
    animes: {},

    mangas: {},
  },
});


class Genre extends model<IGenre>(GenreSchema) { }

Genre.register("genres");

export default Genre;

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


class Genre extends model<IGenre>(GenreSchema) { }

Genre.register("genres");

export default Genre;

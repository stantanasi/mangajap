import { model, Schema } from "@stantanasi/jsonapi-client";
import Anime from "./anime.model";
import Manga from "./manga.model";
import User from "./user.model";

export interface IReview {
  id: string;

  content: string;
  createdAt: Date;
  updatedAt: Date;

  user?: User;
  anime?: Anime;
  manga?: Manga;
}

export const ReviewSchema = new Schema<IReview>({
  attributes: {
    content: {},

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
    user: {},

    anime: {},

    manga: {},
  },
});


export default class Review extends model<IReview>("reviews", ReviewSchema) { }

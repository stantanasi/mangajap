import { model, Schema } from "@stantanasi/jsonapi-client";
import Anime from "./anime.model";
import Episode from "./episode.model";

export interface ISeason {
  id: string;

  number: number;
  title: string;
  overview: string;
  airDate: Date;
  poster: string | null;
  episodeCount: number;
  createdAt: Date;
  updatedAt: Date;

  anime?: Anime;
  episodes?: Episode[];
}

export const SeasonSchema = new Schema<ISeason>({
  attributes: {
    number: {},

    title: {},

    overview: {},

    airDate: {
      get: function (value: string) {
        return new Date(value);
      },
      transform: function (val) {
        return val.toISOString().slice(0, 10);
      },
    },

    poster: {},

    episodeCount: {},

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
    anime: {},

    episodes: {},
  },
});


class Season extends model<ISeason>(SeasonSchema) { }

Season.register("seasons");

export default Season;

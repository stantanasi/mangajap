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
      type: Date,
      transform: function (val) {
        return val.toISOString().slice(0, 10);
      },
    },

    poster: {},

    episodeCount: {},

    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
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

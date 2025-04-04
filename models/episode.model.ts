import { model, Schema } from "@stantanasi/jsonapi-client";
import Anime from "./anime.model";
import EpisodeEntry from "./episode-entry.model";
import Season from "./season.model";

enum EpisodeType {
  None = "",
  Oav = "oav",
}

export interface IEpisode {
  id: string;

  number: number;
  title: string;
  overview: string;
  airDate: Date;
  runtime: number;
  episodeType: EpisodeType;
  poster: string | null;
  createdAt: Date;
  updatedAt: Date;

  anime?: Anime;
  season?: Season;
  "episode-entry"?: EpisodeEntry | null;

}

export const EpisodeSchema = new Schema<IEpisode>({
  attributes: {
    number: {},

    title: {},

    overview: {},

    airDate: {
      get: function (value: string) {
        return new Date(value);
      },
      transform: function (val) {
        return val?.toISOString().slice(0, 10) ?? val;
      },
    },

    runtime: {},

    episodeType: {},

    poster: {},

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

    season: {},

    "episode-entry": {},
  },
});


class Episode extends model<IEpisode>(EpisodeSchema) { }

Episode.register("episodes");

export default Episode;

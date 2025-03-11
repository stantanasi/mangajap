import { model, Schema } from "@stantanasi/jsonapi-client";

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
  },
});


export default class Episode extends model<IEpisode>("episodes", EpisodeSchema) { }

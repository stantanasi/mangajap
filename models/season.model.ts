import { model, Schema } from "@stantanasi/jsonapi-client";

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
  },
});


export default class Season extends model<ISeason>("seasons", SeasonSchema) { }

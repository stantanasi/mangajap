import { model, Schema } from "@stantanasi/jsonapi-client";

export interface IEpisodeEntry {
  id: string;

  watchedDate: Date;
  watchedCount: number;
  rating: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export const EpisodeEntrySchema = new Schema<IEpisodeEntry>({
  attributes: {
    watchedDate: {
      get: function (value: string) {
        return new Date(value);
      },
      transform: function (val) {
        return val.toISOString();
      },
    },

    watchedCount: {},

    rating: {},

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


export default class EpisodeEntry extends model<IEpisodeEntry>("episodes", EpisodeEntrySchema) { }

import { model, Schema } from "@stantanasi/jsonapi-client";
import Episode from "./episode.model";
import User from "./user.model";

export interface IEpisodeEntry {
  id: string;

  watchedDate: Date;
  watchedCount: number;
  rating: number | null;
  createdAt: Date;
  updatedAt: Date;

  user?: User;
  episode?: Episode;
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
    user: {},

    episode: {},
  },
});


class EpisodeEntry extends model<IEpisodeEntry>(EpisodeEntrySchema) { }

EpisodeEntry.register("episode-entries");

export default EpisodeEntry;

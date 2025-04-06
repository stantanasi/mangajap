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
      type: Date,
    },

    watchedCount: {},

    rating: {},

    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
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

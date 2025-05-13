import { model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import Episode from './episode.model';
import User from './user.model';

export interface IEpisodeEntry {
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


class EpisodeEntry extends model<IEpisodeEntry>(EpisodeEntrySchema) {

  static redux = createReduxHelpers<IEpisodeEntry, typeof EpisodeEntry>(EpisodeEntry).register('episode-entries');
}

EpisodeEntry.register('episode-entries');

export default EpisodeEntry;

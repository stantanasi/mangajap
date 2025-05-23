import { model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import { AppDispatch } from '../redux/store';
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

  static redux = {
    ...createReduxHelpers<IEpisodeEntry, typeof EpisodeEntry>(EpisodeEntry).register('episode-entries'),
    sync: (dispatch: AppDispatch, episodeEntry: EpisodeEntry, { episode }: {
      episode: Episode;
    }) => {
      if (episodeEntry.isDeleted) {
        dispatch(EpisodeEntry.redux.actions.removeOne(episodeEntry));
        dispatch(Episode.redux.actions.relations['episode-entry'].remove(episode.id, episodeEntry));
        return
      }

      dispatch(EpisodeEntry.redux.actions.saveOne(episodeEntry));
      dispatch(Episode.redux.actions.relations['episode-entry'].set(episode.id, episodeEntry));
    },
  };
}

EpisodeEntry.register('episode-entries');

export default EpisodeEntry;

import { model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import { AppDispatch } from '../redux/store';
import Anime from './anime.model';
import Change from './change.model';
import Episode from './episode.model';

export interface ISeason {
  number: number;
  title: string;
  overview: string;
  poster: string | null;
  startDate: Date | null;
  endDate: Date | null;
  episodeCount: number;
  createdAt: Date;
  updatedAt: Date;

  anime?: Anime;
  episodes?: Episode[];
  changes?: Change[];
}

export const SeasonSchema = new Schema<ISeason>({
  attributes: {
    number: {},

    title: {},

    overview: {},

    poster: {},

    startDate: {
      type: Date,
      transform: function (val) {
        return val?.toISOString().slice(0, 10) ?? val;
      },
    },

    endDate: {
      type: Date,
      transform: function (val) {
        return val?.toISOString().slice(0, 10) ?? val;
      },
    },

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

    changes: {},
  },
});


class Season extends model<ISeason>(SeasonSchema) {

  static redux = {
    ...createReduxHelpers<ISeason, typeof Season>(Season).register('seasons'),
    sync: (dispatch: AppDispatch, season: Season) => {
      dispatch(Season.redux.actions.saveOne(season));

      if (season.anime) {
        dispatch(Anime.redux.actions.relations.seasons.add(season.anime.id, season));
      }
    },
  };

  get episodeWatchedCount(): number {
    return this.episodes?.filter((episode) => !!episode['episode-entry']).length ?? 0;
  };

  get progress(): number {
    if (this.episodeCount > 0) {
      return (this.episodeWatchedCount / this.episodeCount) * 100;
    } else {
      return 0;
    }
  };
}

Season.register('seasons');

export default Season;

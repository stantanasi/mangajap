import { model, Schema } from '@stantanasi/jsonapi-client';
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


class Season extends model<ISeason>(SeasonSchema) { }

Season.register('seasons');

export default Season;

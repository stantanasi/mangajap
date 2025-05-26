import { Json, model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import { AppDispatch } from '../redux/store';
import Anime from './anime.model';
import Change from './change.model';
import EpisodeEntry from './episode-entry.model';
import Season from './season.model';

export interface IEpisode {
  number: number;
  title: string;
  overview: string;
  airDate: Date;
  runtime: number;
  episodeType: '' | 'oav';
  poster: string | null;
  createdAt: Date;
  updatedAt: Date;

  anime?: Anime;
  season?: Season;
  changes?: Change[];
  'episode-entry'?: EpisodeEntry | null;
}

export const EpisodeSchema = new Schema<IEpisode>({
  attributes: {
    number: {},

    title: {},

    overview: {},

    airDate: {
      type: Date,
      transform: function (val) {
        return val?.toISOString().slice(0, 10) ?? val;
      },
    },

    runtime: {},

    episodeType: {},

    poster: {},

    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
    },
  },

  relationships: {
    anime: {},

    season: {},

    changes: {},

    'episode-entry': {},
  },
});


class Episode extends model<IEpisode>(EpisodeSchema) {

  static redux = {
    ...createReduxHelpers<IEpisode, typeof Episode>(Episode).register('episodes'),
    sync: (dispatch: AppDispatch, episode: Episode, prev: Json<IEpisode>) => {
      dispatch(Episode.redux.actions.saveOne(episode));

      if (episode.anime) {
        dispatch(Anime.redux.actions.relations.episodes.add(episode.anime.id, episode));
      }

      if (episode.season) {
        dispatch(Season.redux.actions.relations.episodes.add(episode.season.id, episode));

        if (prev.season && prev.season.id !== episode.season.id) {
          dispatch(Season.redux.actions.relations.episodes.remove(prev.season.id, episode));
        }
      }
    },
  };
}

Episode.register('episodes');

export default Episode;


export const EpisodeType = {
  '': '',
  oav: 'OAV',

  entries() {
    return Object.entries(this)
      .filter(([key]) => key !== 'entries')
      .map(([key, value]) => ([key, value]) as [IEpisode['episodeType'], string]);
  },
} satisfies Record<IEpisode['episodeType'], string> & {
  entries: () => [IEpisode['episodeType'], string][];
};

import { model, Schema } from '@stantanasi/jsonapi-client';
import Anime from './anime.model';
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

    'episode-entry': {},
  },
});


class Episode extends model<IEpisode>(EpisodeSchema) { }

Episode.register('episodes');

export default Episode;

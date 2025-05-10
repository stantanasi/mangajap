import { model, Schema } from '@stantanasi/jsonapi-client';
import AnimeEntry from './anime-entry.model';
import Change from './change.model';
import Episode from './episode.model';
import Franchise from './franchise.model';
import Genre from './genre.model';
import Review from './review.model';
import Season from './season.model';
import Staff from './staff.model';
import Theme from './theme.model';

export interface IAnime {
  title: string;
  overview: string;
  startDate: Date | null;
  endDate: Date | null;
  origin: string[];
  animeType: 'tv' | 'ova' | 'ona' | 'movie' | 'music' | 'special';
  status: 'airing' | 'finished';
  inProduction: boolean;
  youtubeVideoId: string;
  episodeLength: number;
  poster: string | null;
  banner: string | null;
  links: {
    [site: string]: string;
  };
  seasonCount: number;
  episodeCount: number;
  averageRating: number | null;
  userCount: number;
  favoritesCount: number;
  reviewCount: number;
  popularity: number;
  createdAt: Date;
  updatedAt: Date;

  genres?: Genre[];
  themes?: Theme[];
  seasons?: Season[];
  episodes?: Episode[];
  staff?: Staff[];
  reviews?: Review[];
  franchises?: Franchise[];
  changes?: Change[];
  'anime-entry'?: AnimeEntry | null;
}

export const AnimeSchema = new Schema<IAnime>({
  attributes: {
    title: {},

    overview: {},

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

    origin: {},

    animeType: {},

    status: {},

    inProduction: {},

    youtubeVideoId: {},

    episodeLength: {},

    poster: {},

    banner: {},

    links: {},

    seasonCount: {},

    episodeCount: {},

    averageRating: {},

    userCount: {},

    favoritesCount: {},

    reviewCount: {},

    popularity: {},

    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
    },
  },

  relationships: {
    genres: {},

    themes: {},

    seasons: {},

    episodes: {},

    staff: {},

    reviews: {},

    franchises: {},

    changes: {},

    'anime-entry': {},
  },
});


class Anime extends model<IAnime>(AnimeSchema) { }

Anime.register('anime');

export default Anime;


export const AnimeType = {
  tv: 'Série TV',
  ova: 'OVA',
  ona: 'ONA',
  movie: 'Film',
  music: 'Musique',
  special: 'Spécial',

  entries() {
    return Object.entries(this)
      .filter(([key]) => key !== 'entries')
      .map(([key, value]) => ([key, value]) as [IAnime['animeType'], string]);
  },
} satisfies Record<IAnime['animeType'], string> & {
  entries: () => [IAnime['animeType'], string][];
};

export const AnimeStatus = {
  airing: 'En cours',
  finished: 'Terminé',

  entries() {
    return Object.entries(this)
      .filter(([key]) => key !== 'entries')
      .map(([key, value]) => ([key, value]) as [IAnime['status'], string]);
  },
} satisfies Record<IAnime['status'], string> & {
  entries: () => [IAnime['status'], string][];
};

import { model, Schema } from '@stantanasi/jsonapi-client';
import AnimeEntry from './anime-entry.model';
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
  startDate: Date;
  endDate: Date | null;
  origin: string[];
  animeType: 'tv' | 'ova' | 'ona' | 'movie' | 'music' | 'special';
  status: 'airing' | 'finished' | 'unreleased' | 'upcoming';
  inProduction: boolean;
  youtubeVideoId: string;
  poster: string | null;
  banner: string | null;
  links: {
    [site: string]: string;
  };
  seasonCount: number;
  episodeCount: number;
  episodeLength: number;
  averageRating: number | null;
  ratingRank: number | null;
  popularity: number;
  userCount: number;
  favoritesCount: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;

  genres?: Genre[];
  themes?: Theme[];
  seasons?: Season[];
  episodes?: Episode[];
  staff?: Staff[];
  reviews?: Review[];
  franchises?: Franchise[];
  'anime-entry'?: AnimeEntry | null;
}

export const AnimeSchema = new Schema<IAnime>({
  attributes: {
    title: {},

    overview: {},

    startDate: {
      type: Date,
      transform: function (val) {
        return val.toISOString().slice(0, 10);
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

    poster: {},

    banner: {},

    links: {},

    seasonCount: {},

    episodeCount: {},

    episodeLength: {},

    averageRating: {},

    ratingRank: {},

    popularity: {},

    userCount: {},

    favoritesCount: {},

    reviewCount: {},

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

    'anime-entry': {},
  },
});


class Anime extends model<IAnime>(AnimeSchema) { }

Anime.register('anime');

export default Anime;


export const AnimeType: Record<IAnime['animeType'], string> = {
  tv: 'Série TV',
  ova: 'OVA',
  ona: 'ONA',
  movie: 'Film',
  music: 'Musique',
  special: 'Spécial',
};

export const AnimeStatus: Record<IAnime['status'], string> = {
  airing: 'En cours',
  finished: 'Terminé',
  unreleased: 'À sortir',
  upcoming: 'À venir',
};

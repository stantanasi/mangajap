import { model, Schema } from '@stantanasi/jsonapi-client';
import Chapter from './chapter.model';
import Franchise from './franchise.model';
import Genre from './genre.model';
import MangaEntry from './manga-entry.model';
import Review from './review.model';
import Staff from './staff.model';
import Theme from './theme.model';
import Volume from './volume.model';

export interface IManga {
  id: string;

  title: string;
  overview: string;
  startDate: Date;
  endDate: Date | null;
  origin: string[];
  mangaType: 'bd' | 'comics' | 'josei' | 'kodomo' | 'seijin' | 'seinen' | 'shojo' | 'shonen' | 'doujin' | 'novel' | 'oneshot' | 'webtoon';
  status: 'publishing' | 'finished' | 'unreleased' | 'upcoming';
  poster: string | null;
  banner: string | null;
  links: {
    [site: string]: string;
  };
  volumeCount: number;
  chapterCount: number;
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
  volumes?: Volume[];
  chapters?: Chapter[];
  staff?: Staff[];
  reviews?: Review[];
  franchises?: Franchise[];
  'manga-entry'?: MangaEntry | null;
}

export const MangaSchema = new Schema<IManga>({
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

    mangaType: {},

    status: {},

    poster: {},

    banner: {},

    links: {},

    volumeCount: {},

    chapterCount: {},

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

    volumes: {},

    chapters: {},

    staff: {},

    reviews: {},

    franchises: {},

    'manga-entry': {},
  },
});


class Manga extends model<IManga>(MangaSchema) { }

Manga.register('manga');

export default Manga;

import { model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import { AppDispatch } from '../redux/store';
import Change from './change.model';
import Chapter from './chapter.model';
import Franchise from './franchise.model';
import Genre from './genre.model';
import MangaEntry from './manga-entry.model';
import Review from './review.model';
import Staff from './staff.model';
import Theme from './theme.model';
import Volume from './volume.model';

export interface IManga {
  title: string;
  overview: string;
  origin: string[];
  mangaType: 'bd' | 'comics' | 'josei' | 'kodomo' | 'seijin' | 'seinen' | 'shojo' | 'shonen' | 'doujin' | 'novel' | 'oneshot' | 'webtoon';
  status: 'publishing' | 'finished';
  poster: string | null;
  banner: string | null;
  links: {
    [site: string]: string;
  };
  startDate: Date | null;
  endDate: Date | null;
  volumeCount: number;
  chapterCount: number;
  averageRating: number | null;
  userCount: number;
  favoritesCount: number;
  reviewCount: number;
  popularity: number;
  createdAt: Date;
  updatedAt: Date;

  genres?: Genre[];
  themes?: Theme[];
  volumes?: Volume[];
  chapters?: Chapter[];
  staff?: Staff[];
  reviews?: Review[];
  franchises?: Franchise[];
  changes?: Change[];
  'manga-entry'?: MangaEntry | null;
}

export const MangaSchema = new Schema<IManga>({
  attributes: {
    title: {},

    overview: {},

    origin: {},

    mangaType: {},

    status: {},

    poster: {},

    banner: {},

    links: {},

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

    volumeCount: {},

    chapterCount: {},

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

    volumes: {},

    chapters: {},

    staff: {},

    reviews: {},

    franchises: {},

    changes: {},

    'manga-entry': {},
  },
});


class Manga extends model<IManga>(MangaSchema) {

  static redux = {
    ...createReduxHelpers<IManga, typeof Manga>(Manga).register('manga'),
    sync: (dispatch: AppDispatch, manga: Manga) => {
      dispatch(Manga.redux.actions.saveOne(manga));
    },
  };
}

Manga.register('manga');

export default Manga;


export const MangaType = {
  bd: 'BD',
  comics: 'Comics',
  josei: 'Josei',
  kodomo: 'Kodomo',
  seijin: 'Seijin',
  seinen: 'Seinen',
  shojo: 'Shōjo',
  shonen: 'Shōnen',
  doujin: 'Doujin',
  novel: 'Novel',
  oneshot: 'One shot',
  webtoon: 'Webtoon',

  entries() {
    return Object.entries(this)
      .filter(([key]) => key !== 'entries')
      .map(([key, value]) => ([key, value]) as [IManga['mangaType'], string]);
  },
} satisfies Record<IManga['mangaType'], string> & {
  entries: () => [IManga['mangaType'], string][];
};

export const MangaStatus = {
  publishing: 'En cours',
  finished: 'Terminé',

  entries() {
    return Object.entries(this)
      .filter(([key]) => key !== 'entries')
      .map(([key, value]) => ([key, value]) as [IManga['status'], string]);
  },
} satisfies Record<IManga['status'], string> & {
  entries: () => [IManga['status'], string][];
};

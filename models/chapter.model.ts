import { model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import Change from './change.model';
import ChapterEntry from './chapter-entry.model';
import Manga from './manga.model';
import Volume from './volume.model';

export interface IChapter {
  number: number;
  title: string;
  overview: string;
  publishedDate: Date | null;
  cover: string | null;
  createdAt: Date;
  updatedAt: Date;

  manga?: Manga;
  volume?: Volume | null;
  changes?: Change[];
  'chapter-entry'?: ChapterEntry | null;
}

export const ChapterSchema = new Schema<IChapter>({
  attributes: {
    number: {},

    title: {},

    overview: {},

    publishedDate: {
      type: Date,
      transform: function (val) {
        return val?.toISOString().slice(0, 10) ?? val;
      },
    },

    cover: {},

    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
    },
  },

  relationships: {
    manga: {},

    volume: {},

    changes: {},

    'chapter-entry': {},
  },
});


class Chapter extends model<IChapter>(ChapterSchema) {

  static redux = createReduxHelpers<IChapter, typeof Chapter>(Chapter).register('chapters');
}

Chapter.register('chapters');

export default Chapter;

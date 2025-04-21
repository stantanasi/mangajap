import { model, Schema } from '@stantanasi/jsonapi-client';
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
        return val?.toISOString().slice(0, 10) ?? null;
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

    'chapter-entry': {},
  },
});


class Chapter extends model<IChapter>(ChapterSchema) { }

Chapter.register('chapters');

export default Chapter;

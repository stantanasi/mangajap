import { Json, model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import { AppDispatch } from '../redux/store';
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

  static redux = {
    ...createReduxHelpers<IChapter, typeof Chapter>(Chapter).register('chapters'),
    sync: (dispatch: AppDispatch, chapter: Chapter, prev: Json<IChapter>) => {
      dispatch(Chapter.redux.actions.saveOne(chapter));

      if (chapter.manga) {
        dispatch(Manga.redux.actions.relations.chapters.add(chapter.manga.id, chapter));
      }

      if (chapter.volume) {
        dispatch(Volume.redux.actions.relations.chapters.add(chapter.volume.id, chapter));

        if (prev.volume && prev.volume.id !== chapter.volume.id) {
          dispatch(Volume.redux.actions.relations.chapters.remove(prev.volume.id, chapter));
        }
      }
    },
  };
}

Chapter.register('chapters');

export default Chapter;

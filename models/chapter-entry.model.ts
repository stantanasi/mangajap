import { model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import { AppDispatch } from '../redux/store';
import Chapter from './chapter.model';
import User from './user.model';

export interface IChapterEntry {
  readDate: Date;
  readCount: number;
  rating: number | null;
  createdAt: Date;
  updatedAt: Date;

  user?: User;
  chapter?: Chapter;
}

export const ChapterEntrySchema = new Schema<IChapterEntry>({
  attributes: {
    readDate: {
      type: Date,
    },

    readCount: {},

    rating: {},

    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
    },
  },

  relationships: {
    user: {},

    chapter: {},
  },
});


class ChapterEntry extends model<IChapterEntry>(ChapterEntrySchema) {

  static redux = {
    ...createReduxHelpers<IChapterEntry, typeof ChapterEntry>(ChapterEntry).register('chapter-entries'),
    sync: (dispatch: AppDispatch, chapterEntry: ChapterEntry, { chapter }: {
      chapter: Chapter;
    }) => {
      if (chapterEntry.isDeleted) {
        dispatch(ChapterEntry.redux.actions.removeOne(chapterEntry));
        dispatch(Chapter.redux.actions.relations['chapter-entry'].remove(chapter.id, chapterEntry));
        return
      }

      dispatch(ChapterEntry.redux.actions.saveOne(chapterEntry));
      dispatch(Chapter.redux.actions.relations['chapter-entry'].set(chapter.id, chapterEntry));
    },
  };
}

ChapterEntry.register('chapter-entries');

export default ChapterEntry;

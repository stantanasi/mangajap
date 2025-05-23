import { model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import { AppDispatch } from '../redux/store';
import Change from './change.model';
import Chapter from './chapter.model';
import Manga from './manga.model';
import VolumeEntry from './volume-entry.model';

export interface IVolume {
  number: number;
  title: string;
  overview: string;
  publishedDate: Date | null;
  cover: string | null;
  chapterCount: number;
  startChapter: number | null;
  endChapter: number | null;
  createdAt: Date;
  updatedAt: Date;

  manga?: Manga;
  chapters?: Chapter[];
  changes?: Change[];
  'volume-entry'?: VolumeEntry | null;
}

export const VolumeSchema = new Schema<IVolume>({
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

    chapterCount: {},

    startChapter: {},

    endChapter: {},

    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
    },
  },

  relationships: {
    manga: {},

    chapters: {},

    changes: {},

    'volume-entry': {},
  },
});


class Volume extends model<IVolume>(VolumeSchema) {

  static redux = {
    ...createReduxHelpers<IVolume, typeof Volume>(Volume).register('volumes'),
    sync: (dispatch: AppDispatch, volume: Volume) => {
      dispatch(Volume.redux.actions.saveOne(volume));

      if (volume.manga) {
        dispatch(Manga.redux.actions.relations.volumes.add(volume.manga.id, volume));
      }
    },
  };
}

Volume.register('volumes');

export default Volume;

import { model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import { AppDispatch } from '../redux/store';
import Manga from './manga.model';
import User from './user.model';

export interface IMangaEntry {
  isAdd: boolean;
  isFavorites: boolean;
  status: 'reading' | 'completed' | 'planned' | 'on_hold' | 'dropped';
  volumesRead: number;
  chaptersRead: number;
  rating: number | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  user?: User;
  manga?: Manga;
}

export const MangaEntrySchema = new Schema<IMangaEntry>({
  attributes: {
    isAdd: {},

    isFavorites: {},

    status: {},

    volumesRead: {},

    chaptersRead: {},

    rating: {},

    startedAt: {
      type: Date,
    },

    finishedAt: {
      type: Date,
    },

    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
    },
  },

  relationships: {
    user: {},

    manga: {},
  },
});


class MangaEntry extends model<IMangaEntry>(MangaEntrySchema) {

  static redux = {
    ...createReduxHelpers<IMangaEntry, typeof MangaEntry>(MangaEntry).register('manga-entries'),
    sync: (dispatch: AppDispatch, mangaEntry: MangaEntry, { user, manga }: {
      user: User;
      manga: Manga;
    }) => {
      dispatch(MangaEntry.redux.actions.saveOne(mangaEntry));

      dispatch(MangaEntry.redux.actions.relations.manga.set(mangaEntry.id, manga));
      dispatch(Manga.redux.actions.relations['manga-entry'].set(manga.id, mangaEntry));

      dispatch(mangaEntry.isAdd
        ? User.redux.actions.relations['manga-library'].add(user.id, mangaEntry)
        : User.redux.actions.relations['manga-library'].remove(user.id, mangaEntry)
      );
    },
  };
}

MangaEntry.register('manga-entries');

export default MangaEntry;


export const MangaEntryStatus = {
  reading: 'En cours de lecture',
  completed: 'Terminé',
  planned: 'Prévu',
  on_hold: 'Mis en pause',
  dropped: 'Abandonné',

  entries() {
    return Object.entries(this)
      .filter(([key]) => key !== 'entries')
      .map(([key, value]) => ([key, value]) as [IMangaEntry['status'], string]);
  },
} satisfies Record<IMangaEntry['status'], string> & {
  entries: () => [IMangaEntry['status'], string][];
};

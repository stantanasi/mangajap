import { model, Schema } from '@stantanasi/jsonapi-client';
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


class MangaEntry extends model<IMangaEntry>(MangaEntrySchema) { }

MangaEntry.register('manga-entries');

export default MangaEntry;


export const MangaEntryStatus: Record<IMangaEntry['status'], string> = {
  reading: 'En cours de lecture',
  completed: 'Terminé',
  planned: 'Prévu',
  on_hold: 'Mis en pause',
  dropped: 'Abandonné',
};

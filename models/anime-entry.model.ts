import { model, Schema } from '@stantanasi/jsonapi-client';
import Anime from './anime.model';
import User from './user.model';

export interface IAnimeEntry {
  id: string;

  isAdd: boolean;
  isFavorites: boolean;
  status: 'watching' | 'completed' | 'planned' | 'on_hold' | 'dropped';
  episodesWatch: number;
  rating: number | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  user?: User;
  anime?: Anime;
}

export const AnimeEntrySchema = new Schema<IAnimeEntry>({
  attributes: {
    isAdd: {},

    isFavorites: {},

    status: {},

    episodesWatch: {},

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

    anime: {},
  },
});


class AnimeEntry extends model<IAnimeEntry>(AnimeEntrySchema) { }

AnimeEntry.register('anime-entries');

export default AnimeEntry;

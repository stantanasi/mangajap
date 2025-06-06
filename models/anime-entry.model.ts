import { model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import { AppDispatch } from '../redux/store';
import Anime from './anime.model';
import User from './user.model';

export interface IAnimeEntry {
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


class AnimeEntry extends model<IAnimeEntry>(AnimeEntrySchema) {

  static redux = {
    ...createReduxHelpers<IAnimeEntry, typeof AnimeEntry>(AnimeEntry).register('anime-entries'),
    sync: (dispatch: AppDispatch, animeEntry: AnimeEntry, { anime, user }: {
      user: User;
      anime: Anime;
    }) => {
      dispatch(AnimeEntry.redux.actions.saveOne(animeEntry));

      dispatch(AnimeEntry.redux.actions.relations.anime.set(animeEntry.id, anime));
      dispatch(Anime.redux.actions.relations['anime-entry'].set(anime.id, animeEntry));

      dispatch(animeEntry.isAdd
        ? User.redux.actions.relations['anime-library'].add(user.id, animeEntry)
        : User.redux.actions.relations['anime-library'].remove(user.id, animeEntry)
      );
    },
  };
}

AnimeEntry.register('anime-entries');

export default AnimeEntry;


export const AnimeEntryStatus = {
  watching: 'En cours de visionnage',
  completed: 'Terminé',
  planned: 'Prévu',
  on_hold: 'Mis en pause',
  dropped: 'Abandonné',

  entries() {
    return Object.entries(this)
      .filter(([key]) => key !== 'entries')
      .map(([key, value]) => ([key, value]) as [IAnimeEntry['status'], string]);
  },
} satisfies Record<IAnimeEntry['status'], string> & {
  entries: () => [IAnimeEntry['status'], string][];
};

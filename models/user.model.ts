import { model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import { AppDispatch } from '../redux/store';
import AnimeEntry from './anime-entry.model';
import Follow from './follow.model';
import MangaEntry from './manga-entry.model';
import Review from './review.model';

export interface IUser {
  pseudo: string;
  email?: string;
  password?: string;
  name: string;
  bio: string;
  gender: 'men' | 'women' | 'other' | null;
  birthday: Date | null;
  country: string;
  avatar: string | null;
  followersCount: number;
  followingCount: number;
  followedMangaCount: number;
  volumesRead: number;
  chaptersRead: number;
  followedAnimeCount: number;
  episodesWatch: number;
  timeSpentOnAnime: number;
  createdAt: Date;
  updatedAt: Date;

  followers?: Follow[];
  following?: Follow[];
  'anime-library'?: AnimeEntry[];
  'manga-library'?: MangaEntry[];
  'anime-favorites'?: AnimeEntry[];
  'manga-favorites'?: MangaEntry[];
  reviews?: Review[];
}

export const UserSchema = new Schema<IUser>({
  attributes: {
    pseudo: {},

    email: {},

    password: {},

    name: {},

    bio: {},

    gender: {},

    birthday: {
      type: Date,
      transform: function (val) {
        return val?.toISOString().slice(0, 10) ?? val;
      },
    },

    country: {},

    avatar: {},

    followersCount: {},

    followingCount: {},

    followedMangaCount: {},

    volumesRead: {},

    chaptersRead: {},

    followedAnimeCount: {},

    episodesWatch: {},

    timeSpentOnAnime: {},

    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
    },
  },

  relationships: {
    followers: {},

    following: {},

    'anime-library': {},

    'manga-library': {},

    'anime-favorites': {},

    'manga-favorites': {},

    reviews: {},
  },
});


class User extends model<IUser>(UserSchema) {

  static redux = {
    ...createReduxHelpers<IUser, typeof User>(User).register('users'),
    sync: (dispatch: AppDispatch, user: User) => {
      dispatch(User.redux.actions.saveOne(user));
    },
  };
}

User.register('users');

export default User;


export const UserGender = {
  men: 'Homme',
  women: 'Femme',
  other: 'Autre',

  entries() {
    return Object.entries(this)
      .filter(([key]) => key !== 'entries')
      .map(([key, value]) => ([key, value]) as [NonNullable<IUser['gender']>, string]);
  },
} satisfies Record<NonNullable<IUser['gender']>, string> & {
  entries: () => [NonNullable<IUser['gender']>, string][];
};

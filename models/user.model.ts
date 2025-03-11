import { model, Schema } from "@stantanasi/jsonapi-client";

enum UserGender {
  Men = "men",
  Women = "women",
  Other = "other",
}

export interface IUser {
  id: string;

  pseudo: string;
  firstName: string;
  lastName: string;
  about: string;
  gender: UserGender | null;
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
}

export const UserSchema = new Schema<IUser>({
  attributes: {
    pseudo: {},

    firstName: {},

    lastName: {},

    about: {},

    gender: {},

    birthday: {
      get: function (value: string) {
        return new Date(value);
      },
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
      get: function (value: string) {
        return new Date(value);
      },
      transform: function (val) {
        return val.toISOString();
      },
    },

    updatedAt: {
      get: function (value: string) {
        return new Date(value);
      },
      transform: function (val) {
        return val.toISOString();
      },
    },
  },

  relationships: {
  },
});


export default class User extends model<IUser>("users", UserSchema) { }

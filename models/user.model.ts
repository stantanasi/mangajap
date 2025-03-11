import { model, Schema } from "@stantanasi/jsonapi-client";
import AnimeEntry from "./anime-entry.model";
import Follow from "./follow.model";
import MangaEntry from "./manga-entry.model";
import Request from "./request.model";
import Review from "./review.model";

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

  followers?: Follow[];
  following?: Follow[];
  "anime-library"?: AnimeEntry[];
  "manga-library"?: MangaEntry[];
  "anime-favorites"?: AnimeEntry[];
  "manga-favorites"?: MangaEntry[];
  reviews?: Review[];
  requests?: Request[];
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
    followers: {},

    following: {},

    "anime-library": {},

    "manga-library": {},

    "anime-favorites": {},

    "manga-favorites": {},

    reviews: {},

    requests: {},
  },
});


export default class User extends model<IUser>("users", UserSchema) { }

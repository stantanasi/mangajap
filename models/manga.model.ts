import { model, Schema } from "@stantanasi/jsonapi-client";

enum MangaType {
  Bd = "bd",
  Comics = "comics",
  Josei = "josei",
  Kodomo = "kodomo",
  Seijin = "seijin",
  Seinen = "seinen",
  Shojo = "shojo",
  Shonen = "shonen",
  Doujin = "doujin",
  Novel = "novel",
  Oneshot = "oneshot",
  Webtoon = "webtoon",
}

enum MangaStatus {
  Publishing = "publishing",
  Finished = "finished",
  Unreleased = "unreleased",
  Upcoming = "upcoming",
}

export interface IManga {
  id: string;

  title: string;
  overview: string;
  startDate: Date;
  endDate: Date | null;
  origin: string[];
  mangaType: MangaType;
  status: MangaStatus;
  poster: string | null;
  banner: string | null;
  links: {
    [site: string]: string;
  };
  volumeCount: number;
  chapterCount: number;
  averageRating: number | null;
  ratingRank: number | null;
  popularity: number;
  userCount: number;
  favoritesCount: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const MangaSchema = new Schema<IManga>({
  attributes: {
    title: {},

    overview: {},

    startDate: {
      get: function (value: string) {
        return new Date(value);
      },
      transform: function (val) {
        return val.toISOString().slice(0, 10);
      },
    },

    endDate: {
      get: function (value: string) {
        return new Date(value);
      },
      transform: function (val) {
        return val?.toISOString().slice(0, 10) ?? val;
      },
    },

    origin: {},

    mangaType: {},

    status: {},

    poster: {},

    banner: {},

    links: {},

    volumeCount: {},

    chapterCount: {},

    averageRating: {},

    ratingRank: {},

    popularity: {},

    userCount: {},

    favoritesCount: {},

    reviewCount: {},

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


export default class Manga extends model<IManga>("manga", MangaSchema) { }

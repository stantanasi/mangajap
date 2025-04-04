import { model, Schema } from "@stantanasi/jsonapi-client";
import Chapter from "./chapter.model";
import Franchise from "./franchise.model";
import Genre from "./genre.model";
import MangaEntry from "./manga-entry.model";
import Review from "./review.model";
import Staff from "./staff.model";
import Theme from "./theme.model";
import Volume from "./volume.model";

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

  genres?: Genre[];
  themes?: Theme[];
  volumes?: Volume[];
  chapters?: Chapter[];
  staff?: Staff[];
  reviews?: Review[];
  franchises?: Franchise[];
  "manga-entry"?: MangaEntry | null;
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
    genres: {},

    themes: {},

    volumes: {},

    chapters: {},

    staff: {},

    reviews: {},

    franchises: {},

    "manga-entry": {},
  },
});


class Manga extends model<IManga>(MangaSchema) { }

Manga.register("manga");

export default Manga;

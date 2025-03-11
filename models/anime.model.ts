import { model, Schema } from "@stantanasi/jsonapi-client";

enum AnimeStatus {
  Airing = "airing",
  Finished = "finished",
  Unreleased = "unreleased",
  Upcoming = "upcoming",
}

enum AnimeType {
  Tv = "tv",
  Ova = "ova",
  Ona = "ona",
  Movie = "movie",
  Music = "music",
  Special = "special",
}

export interface IAnime {
  id: string;

  title: string;
  overview: string;
  startDate: Date;
  endDate: Date | null;
  origin: string[];
  animeType: AnimeType;
  status: AnimeStatus;
  inProduction: boolean;
  youtubeVideoId: string;
  poster: string | null;
  banner: string | null;
  links: {
    [site: string]: string;
  };
  seasonCount: number;
  episodeCount: number;
  episodeLength: number;
  averageRating: number | null;
  ratingRank: number | null;
  popularity: number;
  userCount: number;
  favoritesCount: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export const AnimeSchema = new Schema<IAnime>({
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

    animeType: {},

    status: {},

    inProduction: {},

    youtubeVideoId: {},

    poster: {},

    banner: {},

    links: {},

    seasonCount: {},

    episodeCount: {},

    episodeLength: {},

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



export default class Anime extends model<IAnime>("anime", AnimeSchema) { }

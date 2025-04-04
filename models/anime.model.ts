import { model, Schema } from "@stantanasi/jsonapi-client";
import AnimeEntry from "./anime-entry.model";
import Episode from "./episode.model";
import Franchise from "./franchise.model";
import Genre from "./genre.model";
import Review from "./review.model";
import Season from "./season.model";
import Staff from "./staff.model";
import Theme from "./theme.model";

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

  genres?: Genre[];
  themes?: Theme[];
  seasons?: Season[];
  episodes?: Episode[];
  staff?: Staff[];
  reviews?: Review[];
  franchises?: Franchise[];
  "anime-entry"?: AnimeEntry | null;
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
    genres: {},

    themes: {},

    seasons: {},

    episodes: {},

    staff: {},

    reviews: {},

    franchises: {},

    "anime-entry": {},
  },
});


class Anime extends model<IAnime>(AnimeSchema) { }

Anime.register("anime");

export default Anime;

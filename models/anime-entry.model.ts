import { model, Schema } from "@stantanasi/jsonapi-client";
import Anime from "./anime.model";
import User from "./user.model";

enum AnimeEntryStatus {
  Watching = "watching",
  Completed = "completed",
  Planned = "planned",
  OnHold = "on_hold",
  Dropped = "dropped",
}

export interface IAnimeEntry {
  id: string;

  isAdd: boolean;
  isFavorites: boolean;
  status: AnimeEntryStatus;
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

    startedAt: {},

    finishedAt: {},

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
    user: {},

    anime: {},
  },
});


class AnimeEntry extends model<IAnimeEntry>(AnimeEntrySchema) { }

AnimeEntry.register("anime-entries");

export default AnimeEntry;

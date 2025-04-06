import { model, Schema } from "@stantanasi/jsonapi-client";
import Manga from "./manga.model";
import User from "./user.model";

enum MangaEntryStatus {
  Reading = "reading",
  Completed = "completed",
  Planned = "planned",
  OnHold = "on_hold",
  Dropped = "dropped",
}

export interface IMangaEntry {
  id: string;

  isAdd: boolean;
  isFavorites: boolean;
  status: MangaEntryStatus;
  volumesRead: number;
  chaptersRead: number;
  rating: number | null;
  startedAt: Date | null;
  finishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  user?: User;
  manga?: Manga;
}

export const MangaEntrySchema = new Schema<IMangaEntry>({
  attributes: {
    isAdd: {},

    isFavorites: {},

    status: {},

    volumesRead: {},

    chaptersRead: {},

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

    manga: {},
  },
});


class MangaEntry extends model<IMangaEntry>(MangaEntrySchema) { }

MangaEntry.register("manga-entries");

export default MangaEntry;

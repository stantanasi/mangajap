import { model, Schema } from "@stantanasi/jsonapi-client";

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
      get: function (value: string) {
        return new Date(value);
      },
      transform: function (val) {
        return val?.toISOString() ?? val;
      },
    },

    finishedAt: {
      get: function (value: string) {
        return new Date(value);
      },
      transform: function (val) {
        return val?.toISOString() ?? val;
      },
    },

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


export default class MangaEntry extends model<IMangaEntry>("manga-entries", MangaEntrySchema) { }

import { model, Schema } from "@stantanasi/jsonapi-client";
import Chapter from "./chapter.model";
import User from "./user.model";

export interface IChapterEntry {
  id: string;

  readDate: Date;
  readCount: number;
  rating: number | null;
  createdAt: Date;
  updatedAt: Date;

  user?: User;
  chapter?: Chapter;
}

export const ChapterEntrySchema = new Schema<IChapterEntry>({
  attributes: {
    readDate: {},

    readCount: {},

    rating: {},

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

    chapter: {},
  },
});


export default class ChapterEntry extends model<IChapterEntry>("chapter-entries", ChapterEntrySchema) { }

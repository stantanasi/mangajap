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
    readDate: {
      type: Date,
    },

    readCount: {},

    rating: {},

    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
    },
  },

  relationships: {
    user: {},

    chapter: {},
  },
});


class ChapterEntry extends model<IChapterEntry>(ChapterEntrySchema) { }

ChapterEntry.register("chapter-entries");

export default ChapterEntry;

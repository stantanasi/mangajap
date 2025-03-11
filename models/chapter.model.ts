import { model, Schema } from "@stantanasi/jsonapi-client";
import ChapterEntry from "./chapter-entry.model";
import Manga from "./manga.model";
import Volume from "./volume.model";

export interface IChapter {
  id: string;

  number: number;
  title: string;
  overview: string;
  publishedDate: Date;
  cover: string | null;
  createdAt: Date;
  updatedAt: Date;

  manga?: Manga;
  volume?: Volume | null;
  "chapter-entry"?: ChapterEntry | null;
}

export const ChapterSchema = new Schema<IChapter>({
  attributes: {
    number: {},

    title: {},

    overview: {},

    publishedDate: {
      get: function (value: string) {
        return new Date(value);
      },
      transform: function (val) {
        return val.toISOString().slice(0, 10);
      },
    },

    cover: {},

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
    manga: {},

    volume: {},

    "chapter-entry": {},
  },
});


export default class Chapter extends model<IChapter>("chapters", ChapterSchema) { }

import { model, Schema } from "@stantanasi/jsonapi-client";

export interface IVolume {
  id: string;

  number: number;
  title: string;
  overview: string;
  publishedDate: Date;
  cover: string | null;
  chapterCount: number;
  startChapter: number | null;
  endChapter: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export const VolumeSchema = new Schema<IVolume>({
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

    chapterCount: {},

    startChapter: {},

    endChapter: {},

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


export default class Volume extends model<IVolume>("volumes", VolumeSchema) { }

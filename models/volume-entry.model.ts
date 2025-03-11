import { model, Schema } from "@stantanasi/jsonapi-client";

export interface IVolumeEntry {
  id: string;

  readDate: Date;
  readCount: number;
  rating: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export const VolumeEntrySchema = new Schema<IVolumeEntry>({
  attributes: {
    readDate: {
      get: function (value: string) {
        return new Date(value);
      },
      transform: function (val) {
        return val.toISOString();
      },
    },

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
  },
});


export default class VolumeEntry extends model<IVolumeEntry>("volume-entries", VolumeEntrySchema) { }

import { model, Schema } from "@stantanasi/jsonapi-client";
import User from "./user.model";
import Volume from "./volume.model";

export interface IVolumeEntry {
  id: string;

  readDate: Date;
  readCount: number;
  rating: number | null;
  createdAt: Date;
  updatedAt: Date;

  user?: User;
  volume?: Volume;
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
    user: {},

    volume: {},
  },
});


class VolumeEntry extends model<IVolumeEntry>(VolumeEntrySchema) { }

VolumeEntry.register("volume-entries");

export default VolumeEntry;

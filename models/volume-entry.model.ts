import { model, Schema } from '@stantanasi/jsonapi-client';
import User from './user.model';
import Volume from './volume.model';

export interface IVolumeEntry {
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

    volume: {},
  },
});


class VolumeEntry extends model<IVolumeEntry>(VolumeEntrySchema) { }

VolumeEntry.register('volume-entries');

export default VolumeEntry;

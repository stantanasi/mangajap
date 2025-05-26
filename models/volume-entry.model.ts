import { model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import { AppDispatch } from '../redux/store';
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


class VolumeEntry extends model<IVolumeEntry>(VolumeEntrySchema) {

  static redux = {
    ...createReduxHelpers<IVolumeEntry, typeof VolumeEntry>(VolumeEntry).register('volume-entries'),
    sync: (dispatch: AppDispatch, volumeEntry: VolumeEntry, { volume }: {
      volume: Volume;
    }) => {
      if (volumeEntry.isDeleted) {
        dispatch(VolumeEntry.redux.actions.removeOne(volumeEntry));
        dispatch(Volume.redux.actions.relations['volume-entry'].remove(volume.id, volumeEntry));
        return
      }

      dispatch(VolumeEntry.redux.actions.saveOne(volumeEntry));
      dispatch(Volume.redux.actions.relations['volume-entry'].set(volume.id, volumeEntry));
    },
  };
}

VolumeEntry.register('volume-entries');

export default VolumeEntry;

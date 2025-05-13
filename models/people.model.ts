import { model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import Change from './change.model';
import Staff from './staff.model';

export interface IPeople {
  name: string;
  portrait: string | null;
  createdAt: Date;
  updatedAt: Date;

  staff?: Staff[];
  'anime-staff'?: Staff[];
  'manga-staff'?: Staff[];
  changes?: Change[];
}

export const PeopleSchema = new Schema<IPeople>({
  attributes: {
    name: {},

    portrait: {},

    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
    },
  },

  relationships: {
    staff: {},

    'anime-staff': {},

    'manga-staff': {},

    changes: {},
  },
});


class People extends model<IPeople>(PeopleSchema) {

  static redux = createReduxHelpers<IPeople, typeof People>(People).register('peoples');
}

People.register('peoples');

export default People;

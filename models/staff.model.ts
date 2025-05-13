import { model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import Anime from './anime.model';
import Change from './change.model';
import Manga from './manga.model';
import People from './people.model';

export interface IStaff {
  role: 'author' | 'illustrator' | 'story_and_art' | 'licensor' | 'producer' | 'studio' | 'original_creator';
  createdAt: Date;
  updatedAt: Date;

  people?: People;
  anime?: Anime;
  manga?: Manga;
  changes?: Change[];
}

export const StaffSchema = new Schema<IStaff>({
  attributes: {
    role: {},

    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
    },
  },

  relationships: {
    people: {},

    anime: {},

    manga: {},

    changes: {},
  },
});


class Staff extends model<IStaff>(StaffSchema) {

  static redux = createReduxHelpers<IStaff, typeof Staff>(Staff).register('staff');
}

Staff.register('staff');

export default Staff;


export const StaffRole = {
  author: 'Scénariste',
  illustrator: 'Dessinateur',
  story_and_art: 'Créateur',
  licensor: 'Éditeur',
  producer: 'Producteur',
  studio: 'Studio',
  original_creator: 'Créateur original',

  entries() {
    return Object.entries(this)
      .filter(([key]) => key !== 'entries')
      .map(([key, value]) => ([key, value]) as [IStaff['role'], string]);
  },
} satisfies Record<IStaff['role'], string> & {
  entries: () => [IStaff['role'], string][];
};

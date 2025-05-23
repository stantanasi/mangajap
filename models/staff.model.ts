import { Json, model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import { AppDispatch } from '../redux/store';
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

  static redux = {
    ...createReduxHelpers<IStaff, typeof Staff>(Staff).register('staff'),
    sync: (dispatch: AppDispatch, staff: Staff, prev: Json<IStaff>) => {
      dispatch(Staff.redux.actions.saveOne(staff));

      if (staff.people) {
        dispatch(Staff.redux.actions.relations.people.set(staff.id, staff.people));
      }

      if (staff.anime && staff.anime instanceof Anime) {
        dispatch(Anime.redux.actions.relations.staff.add(staff.anime.id, staff));
      } else if (staff.manga && staff.manga instanceof Manga) {
        dispatch(Manga.redux.actions.relations.staff.add(staff.manga.id, staff));
      }

      if (staff.people) {
        dispatch(People.redux.actions.relations.staff.add(staff.people.id, staff));

        if (prev.people && prev.people.id !== staff.people.id) {
          dispatch(People.redux.actions.relations.staff.remove(prev.people.id, staff));
        }
      }
    },
  };
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

import { model, Schema } from '@stantanasi/jsonapi-client';
import Anime from './anime.model';
import Manga from './manga.model';
import People from './people.model';

export interface IStaff {
  role: 'author' | 'illustrator' | 'story_and_art' | 'licensor' | 'producer' | 'studio' | 'original_creator';
  createdAt: Date;
  updatedAt: Date;

  people?: People;
  anime?: Anime;
  manga?: Manga;
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
  },
});


class Staff extends model<IStaff>(StaffSchema) { }

Staff.register('staff');

export default Staff;

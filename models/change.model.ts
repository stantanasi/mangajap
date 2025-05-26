import { Theme } from '@react-navigation/native';
import { model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import Anime from './anime.model';
import Chapter from './chapter.model';
import Episode from './episode.model';
import Franchise from './franchise.model';
import Genre from './genre.model';
import Manga from './manga.model';
import People from './people.model';
import Season from './season.model';
import Staff from './staff.model';
import User from './user.model';
import Volume from './volume.model';

export interface IChange {
  action: 'create' | 'update' | 'delete';
  changes: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  };
  createdAt: Date;
  updatedAt: Date;

  document?: Anime | Chapter | Episode | Franchise | Genre | Manga | People | Season | Staff | Theme | Volume;
  user?: User;
}

export const ChangeSchema = new Schema<IChange>({
  attributes: {
    action: {},

    changes: {},

    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
    },
  },

  relationships: {
    document: {},

    user: {},
  },
});


class Change extends model<IChange>(ChangeSchema) {

  static redux = createReduxHelpers<IChange, typeof Change>(Change).register('changes');
}

Change.register('changes');

export default Change;
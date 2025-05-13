import { model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import Anime from './anime.model';
import Change from './change.model';
import Manga from './manga.model';

export interface IGenre {
  name: string;
  createdAt: Date;
  updatedAt: Date;

  animes?: Anime[];
  mangas?: Manga[];
  changes?: Change[];
}

export const GenreSchema = new Schema<IGenre>({
  attributes: {
    name: {},

    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
    },
  },

  relationships: {
    animes: {},

    mangas: {},

    changes: {},
  },
});


class Genre extends model<IGenre>(GenreSchema) {

  static redux = createReduxHelpers<IGenre, typeof Genre>(Genre).register('genres');
}

Genre.register('genres');

export default Genre;

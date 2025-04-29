import { model, Schema } from '@stantanasi/jsonapi-client';
import Anime from './anime.model';
import Change from './change.model';
import Manga from './manga.model';

export interface ITheme {
  name: string;
  createdAt: Date;
  updatedAt: Date;

  animes?: Anime[];
  mangas?: Manga[];
  changes?: Change[];
}

export const ThemeSchema = new Schema<ITheme>({
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


class Theme extends model<ITheme>(ThemeSchema) { }

Theme.register('themes');

export default Theme;

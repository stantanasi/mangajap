import { model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import { AppDispatch } from '../redux/store';
import Anime from './anime.model';
import Change from './change.model';
import Manga from './manga.model';

export interface IFranchise {
  role: 'adaptation' | 'alternative_setting' | 'alternative_version' | 'character' | 'full_story' | 'other' | 'parent_story' | 'prequel' | 'sequel' | 'side_story' | 'spinoff' | 'summary';
  createdAt: Date;
  updatedAt: Date;

  source?: Anime | Manga;
  destination?: Anime | Manga;
  changes?: Change[];
}

export const FranchiseSchema = new Schema<IFranchise>({
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
    source: {},

    destination: {},

    changes: {},
  },
});


class Franchise extends model<IFranchise>(FranchiseSchema) {

  static redux = {
    ...createReduxHelpers<IFranchise, typeof Franchise>(Franchise).register('franchises'),
    sync: (dispatch: AppDispatch, franchise: Franchise) => {
      dispatch(Franchise.redux.actions.saveOne(franchise));

      if (franchise.destination) {
        dispatch(Franchise.redux.actions.relations.destination.set(franchise.id, franchise.destination));
      }

      if (franchise.source && franchise.source instanceof Anime) {
        dispatch(Anime.redux.actions.relations.franchises.add(franchise.source.id, franchise));
      } else if (franchise.source && franchise.source instanceof Manga) {
        dispatch(Manga.redux.actions.relations.franchises.add(franchise.source.id, franchise));
      }
    },
  };
}

Franchise.register('franchises');

export default Franchise;


export const FranchiseRole = {
  adaptation: 'Adaptation',
  alternative_setting: 'Univers alternatif',
  alternative_version: 'Version alternative',
  character: 'Personnage',
  full_story: 'Histoire complète',
  other: 'Autre',
  parent_story: 'Histoire principale',
  prequel: 'Préquelle',
  sequel: 'Suite',
  side_story: 'Histoire parallèle',
  spinoff: 'Spin-off',
  summary: 'Résumé',

  entries() {
    return Object.entries(this)
      .filter(([key]) => key !== 'entries')
      .map(([key, value]) => ([key, value]) as [IFranchise['role'], string]);
  },
} satisfies Record<IFranchise['role'], string> & {
  entries: () => [IFranchise['role'], string][];
};
import { model, Schema } from '@stantanasi/jsonapi-client';
import Anime from './anime.model';
import Manga from './manga.model';

export interface IFranchise {
  role: 'adaptation' | 'alternative_setting' | 'alternative_version' | 'character' | 'full_story' | 'other' | 'parent_story' | 'prequel' | 'sequel' | 'side_story' | 'spinoff' | 'summary';
  createdAt: Date;
  updatedAt: Date;

  source?: Anime | Manga;
  destination?: Anime | Manga;
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
  },
});


class Franchise extends model<IFranchise>(FranchiseSchema) { }

Franchise.register('franchises');

export default Franchise;


export const FranchiseRole: Record<IFranchise['role'], string> = {
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
};
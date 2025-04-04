import { model, Schema } from "@stantanasi/jsonapi-client";
import Anime from "./anime.model";
import Manga from "./manga.model";

enum FranchiseRole {
  Adaptation = "adaptation",
  AlternativeSetting = "alternative_setting",
  AlternativeVersion = "alternative_version",
  Character = "character",
  FullStory = "full_story",
  Other = "other",
  ParentStory = "parent_story",
  Prequel = "prequel",
  Sequel = "sequel",
  SideStory = "side_story",
  Spinoff = "spinoff",
  Summary = "summary",
}

export interface IFranchise {
  id: string;

  role: FranchiseRole;
  createdAt: Date;
  updatedAt: Date;

  source?: Anime | Manga;
  destination?: Anime | Manga;
}

export const FranchiseSchema = new Schema<IFranchise>({
  attributes: {
    role: {},

    createdAt: {
      get: function (value: string) {
        return new Date(value);
      },
      transform: function (val) {
        return val.toISOString();
      },
    },

    updatedAt: {
      get: function (value: string) {
        return new Date(value);
      },
      transform: function (val) {
        return val.toISOString();
      },
    },
  },

  relationships: {
    source: {},

    destination: {},
  },
});


class Franchise extends model<IFranchise>(FranchiseSchema) { }

Franchise.register("franchises");

export default Franchise;

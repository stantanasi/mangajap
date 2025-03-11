import { model, Schema } from "@stantanasi/jsonapi-client";

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
  },
});


export default class Franchise extends model<IFranchise>("franchises", FranchiseSchema) { }

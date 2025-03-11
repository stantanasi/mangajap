import { model, Schema } from "@stantanasi/jsonapi-client";

enum StaffRole {
  Author = "author",
  Illustrator = "illustrator",
  StoryAndArt = "story_and_art",
  Licensor = "licensor",
  Producer = "producer",
  Studio = "studio",
  OriginalCreator = "original_creator",
}

export interface IStaff {
  id: string;

  role: StaffRole;
  createdAt: Date;
  updatedAt: Date;
}

export const StaffSchema = new Schema<IStaff>({
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


export default class Staff extends model<IStaff>("staff", StaffSchema) { }

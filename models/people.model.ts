import { model, Schema } from "@stantanasi/jsonapi-client";
import Staff from "./staff.model";

export interface IPeople {
  id: string;

  name: string;
  portrait: string | null;
  createdAt: Date;
  updatedAt: Date;

  staff?: Staff[];
  "anime-staff"?: Staff[];
  "manga-staff"?: Staff[];
}

export const PeopleSchema = new Schema<IPeople>({
  attributes: {
    name: {},

    portrait: {},

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
    staff: {},

    "anime-staff": {},

    "manga-staff": {},
  },
});


class People extends model<IPeople>(PeopleSchema) { }

People.register("peoples");

export default People;

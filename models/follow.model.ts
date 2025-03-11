import { model, Schema } from "@stantanasi/jsonapi-client";
import User from "./user.model";

export interface IFollow {
  id: string;

  createdAt: Date;
  updatedAt: Date;

  follower?: User;
  followed?: User;
}

export const FollowSchema = new Schema<IFollow>({
  attributes: {
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
    follower: {},

    followed: {},
  },
});


export default class Follow extends model<IFollow>("Follow", FollowSchema) { }

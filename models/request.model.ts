import { model, Schema } from "@stantanasi/jsonapi-client";
import User from "./user.model";

export interface IRequest {
  id: string;

  requestType: string;
  data: string;
  isDone: boolean;
  userHasRead: boolean;
  createdAt: Date;
  updatedAt: Date;

  user?: User;
}

export const RequestSchema = new Schema<IRequest>({
  attributes: {
    requestType: {},

    data: {},

    isDone: {},

    userHasRead: {},

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
    user: {},
  },
});


export default class Request extends model<IRequest>("requests", RequestSchema) { }

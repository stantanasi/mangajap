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
      type: Date,
    },

    updatedAt: {
      type: Date,
    },
  },

  relationships: {
    user: {},
  },
});


class Request extends model<IRequest>(RequestSchema) { }

Request.register("requests");

export default Request;

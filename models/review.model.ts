import { model, Schema } from "@stantanasi/jsonapi-client";

export interface IReview {
  id: string;

  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const ReviewSchema = new Schema<IReview>({
  attributes: {
    content: {},

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


export default class Review extends model<IReview>("reviews", ReviewSchema) { }

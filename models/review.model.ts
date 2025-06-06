import { model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import Anime from './anime.model';
import Manga from './manga.model';
import User from './user.model';

export interface IReview {
  content: string;
  createdAt: Date;
  updatedAt: Date;

  user?: User;
  anime?: Anime;
  manga?: Manga;
}

export const ReviewSchema = new Schema<IReview>({
  attributes: {
    content: {},

    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
    },
  },

  relationships: {
    user: {},

    anime: {},

    manga: {},
  },
});


class Review extends model<IReview>(ReviewSchema) {

  static redux = createReduxHelpers<IReview, typeof Review>(Review).register('reviews');
}

Review.register('reviews');

export default Review;

import { model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import User from './user.model';

export interface IFollow {
  createdAt: Date;
  updatedAt: Date;

  follower?: User;
  followed?: User;
}

export const FollowSchema = new Schema<IFollow>({
  attributes: {
    createdAt: {
      type: Date,
    },

    updatedAt: {
      type: Date,
    },
  },

  relationships: {
    follower: {},

    followed: {},
  },
});


class Follow extends model<IFollow>(FollowSchema) {

  static redux = createReduxHelpers<IFollow, typeof Follow>(Follow).register('follows');
}

Follow.register('follows');

export default Follow;

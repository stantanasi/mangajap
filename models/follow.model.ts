import { model, Schema } from '@stantanasi/jsonapi-client';
import { createReduxHelpers } from '../redux/helpers/createReduxHelpers';
import { AppDispatch } from '../redux/store';
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

  static redux = {
    ...createReduxHelpers<IFollow, typeof Follow>(Follow).register('follows'),
    sync: (dispatch: AppDispatch, follow: Follow, { follower, followed }: {
      follower: User;
      followed: User;
    }) => {
      if (follow.isDeleted) {
        dispatch(Follow.redux.actions.removeOne(follow));
        dispatch(User.redux.actions.relations.following.remove(follower.id, follow));
        dispatch(User.redux.actions.relations.followers.remove(followed.id, follow));
        return
      }

      dispatch(Follow.redux.actions.saveOne(follow));
      dispatch(Follow.redux.actions.relations.follower.set(follow.id, follower));
      dispatch(Follow.redux.actions.relations.followed.set(follow.id, followed));
      dispatch(User.redux.actions.relations.following.add(follower.id, follow));
      dispatch(User.redux.actions.relations.followers.add(followed.id, follow));
    },
  };
}

Follow.register('follows');

export default Follow;

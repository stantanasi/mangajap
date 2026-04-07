import { ComponentProps, useEffect, useState } from 'react';
import { Follow, User } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import notify from '../../../utils/notify';
import FollowsScreen from '../FollowsScreen';

export const useFollows = (params: ComponentProps<typeof FollowsScreen>['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const follows = useAppSelector((state) => {
    if (params.type === 'followers') {
      return User.redux.selectors.selectRelation(state, params.userId, 'followers', {
        include: {
          follower: true,
        },
        sort: {
          createdAt: 'desc',
        },
      });
    } else if (params.type === 'following') {
      return User.redux.selectors.selectRelation(state, params.userId, 'following', {
        include: {
          followed: true,
        },
        sort: {
          createdAt: 'desc',
        },
      });
    }

    return undefined;
  });

  useEffect(() => {
    const prepare = async () => {
      if (params.type === 'followers') {
        const followers = await User.findById(params.userId).get('followers')
          .include({ follower: true })
          .sort({ createdAt: 'desc' })
          .limit(1000);

        dispatch(Follow.redux.actions.setMany(followers));
        dispatch(User.redux.actions.relations['followers'].addMany(params.userId, followers));
      } else if (params.type === 'following') {
        const following = await User.findById(params.userId).get('following')
          .include({ followed: true })
          .sort({ createdAt: 'desc' })
          .limit(1000);

        dispatch(Follow.redux.actions.setMany(following));
        dispatch(User.redux.actions.relations['following'].addMany(params.userId, following));
      }
    };

    setIsLoading(true);
    prepare()
      .catch((err) => notify.error('follows_load', err))
      .finally(() => setIsLoading(false));
  }, [params]);

  return { isLoading, follows };
};

import { ComponentProps, useEffect, useState } from 'react';
import { Follow, User } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import notify from '../../../utils/notify';
import FollowsScreen from '../FollowsScreen';

export const useFollows = ({
  type,
  userId,
}: ComponentProps<typeof FollowsScreen>) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const follows = useAppSelector((state) => {
    if (type === 'followers') {
      return User.redux.selectors.selectRelation(state, userId, 'followers', {
        include: {
          follower: true,
        },
        sort: {
          createdAt: 'desc',
        },
      });
    } else if (type === 'following') {
      return User.redux.selectors.selectRelation(state, userId, 'following', {
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
      if (type === 'followers') {
        const followers = await User.findById(userId).get('followers')
          .include({ follower: true })
          .sort({ createdAt: 'desc' })
          .limit(1000);

        dispatch(Follow.redux.actions.setMany(followers));
        dispatch(User.redux.actions.relations['followers'].addMany(userId, followers));
      } else if (type === 'following') {
        const following = await User.findById(userId).get('following')
          .include({ followed: true })
          .sort({ createdAt: 'desc' })
          .limit(1000);

        dispatch(Follow.redux.actions.setMany(following));
        dispatch(User.redux.actions.relations['following'].addMany(userId, following));
      }
    };

    setIsLoading(true);
    prepare()
      .catch((err) => notify.error('follows_load', err))
      .finally(() => setIsLoading(false));
  }, [type, userId]);

  return { isLoading, follows };
};

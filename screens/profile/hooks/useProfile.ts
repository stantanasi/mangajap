import { ComponentProps, useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Follow, User } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import ProfileScreen from '../ProfileScreen';

export const useProfile = (params: ComponentProps<typeof ProfileScreen>['route']['params']) => {
  const dispatch = useAppDispatch();
  const { user: authenticatedUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const userId = params?.id ?? authenticatedUser?.id;

  const user = useAppSelector((state) => {
    if (!userId) {
      return undefined;
    }

    return User.redux.selectors.selectById(state, userId, {
      include: {
        'anime-library': {
          include: {
            anime: true,
          },
          sort: {
            updatedAt: 'desc',
          },
          limit: 20,
        },
        'manga-library': {
          include: {
            manga: true,
          },
          sort: {
            updatedAt: 'desc',
          },
          limit: 20,
        },
        'anime-favorites': {
          include: {
            anime: true,
          },
          sort: {
            updatedAt: 'desc',
          },
          limit: 20,
        },
        'manga-favorites': {
          include: {
            manga: true,
          },
          sort: {
            updatedAt: 'desc',
          },
          limit: 20,
        },
      }
    });
  });

  const followingUser = useAppSelector((state) => {
    if (!authenticatedUser || authenticatedUser.id === userId) {
      return null;
    }

    return Follow.redux.selectors.select(state, {
      filter: {
        follower: new User({ id: authenticatedUser.id }),
        followed: new User({ id: userId }),
      },
    })?.[0] ?? null;
  });

  const followedByUser = useAppSelector((state) => {
    if (!authenticatedUser || authenticatedUser.id === userId) {
      return null;
    }

    return Follow.redux.selectors.select(state, {
      filter: {
        follower: new User({ id: userId }),
        followed: new User({ id: authenticatedUser.id }),
      },
    })?.[0] ?? null;
  });

  useEffect(() => {
    if (!userId) return;

    const prepare = async () => {
      const [user, followingUser, followedByUser] = await Promise.all([
        User.findById(userId)
          .include({
            'anime-library': { anime: true },
            'manga-library': { manga: true },
            'anime-favorites': { anime: true },
            'manga-favorites': { manga: true },
          }),

        ...(authenticatedUser && userId !== authenticatedUser.id
          ? [
            Follow.find({
              follower: authenticatedUser.id,
              followed: userId,
            } as any).then((follows) => follows[0] ?? null),
            Follow.find({
              follower: userId,
              followed: authenticatedUser.id,
            } as any).then((follows) => follows[0] ?? null),
          ]
          : [null, null]),
      ]);

      dispatch(User.redux.actions.setOne(user));
      if (followingUser && authenticatedUser) {
        dispatch(Follow.redux.actions.setOne(followingUser));
        dispatch(Follow.redux.actions.relations.follower.set(followingUser.id, new User({ id: authenticatedUser.id })));
        dispatch(Follow.redux.actions.relations.followed.set(followingUser.id, new User({ id: userId })));
      }
      if (followedByUser && authenticatedUser) {
        dispatch(Follow.redux.actions.setOne(followedByUser));
        dispatch(Follow.redux.actions.relations.follower.set(followedByUser.id, new User({ id: userId })));
        dispatch(Follow.redux.actions.relations.followed.set(followedByUser.id, new User({ id: authenticatedUser.id })));
      }
    };

    setIsLoading(true);
    prepare()
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [userId]);

  return { isLoading, user, followingUser, followedByUser };
};
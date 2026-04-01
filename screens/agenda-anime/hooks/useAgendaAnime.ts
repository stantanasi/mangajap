import { ComponentProps, useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { AnimeEntry, User } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import AgendaAnimeScreen from '../AgendaAnimeScreen';

export const useAgendaAnime = (params: ComponentProps<typeof AgendaAnimeScreen>['route']['params']) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const animeLibrary = useAppSelector((state) => {
    if (!user) {
      return undefined;
    }

    return User.redux.selectors.selectRelation(state, user.id, 'anime-library', {
      include: {
        anime: true,
      },
      sort: {
        updatedAt: 'desc',
      },
    });
  });

  useEffect(() => {
    const prepare = async () => {
      if (!user) return;

      const animeLibrary = await User.findById(user.id).get('anime-library')
        .include({
          anime: true,
        })
        .sort({ updatedAt: 'desc' })
        .limit(500);

      dispatch(AnimeEntry.redux.actions.setMany(animeLibrary));
      dispatch(User.redux.actions.relations['anime-library'].addMany(user.id, animeLibrary));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [user]);

  return { isLoading, animeLibrary };
};

import { ComponentProps, useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Anime, Manga, People } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import DiscoverScreen from '../DiscoverScreen';

export const useDiscover = (params: ComponentProps<typeof DiscoverScreen>['route']['params']) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const peoples = useAppSelector((state) => {
    return People.redux.selectors.select(state, {
      sort: {
        createdAt: 'desc',
      },
      limit: 10,
    });
  });

  const animes = useAppSelector((state) => {
    return Anime.redux.selectors.select(state, {
      include: {
        'anime-entry': isAuthenticated,
      },
      sort: {
        createdAt: 'desc',
      },
      limit: 10,
    });
  });

  const mangas = useAppSelector((state) => {
    return Manga.redux.selectors.select(state, {
      include: {
        'manga-entry': isAuthenticated,
      },
      sort: {
        createdAt: 'desc',
      },
      limit: 10,
    });
  });

  useEffect(() => {
    const prepare = async () => {
      const [peoples, animes, mangas] = await Promise.all([
        People.find()
          .sort({
            createdAt: 'desc',
          }),
        Anime.find()
          .include({
            'anime-entry': isAuthenticated,
          })
          .sort({
            createdAt: 'desc',
          }),
        Manga.find()
          .include({
            'manga-entry': isAuthenticated,
          })
          .sort({
            createdAt: 'desc',
          }),
      ]);

      dispatch(People.redux.actions.setMany(peoples));
      dispatch(Anime.redux.actions.setMany(animes));
      dispatch(Manga.redux.actions.setMany(mangas));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return { isLoading, peoples, animes, mangas };
};

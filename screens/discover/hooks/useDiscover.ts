import { useEffect, useState } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';
import { Anime, Manga } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import notify from '../../../utils/notify';

export const useDiscover = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);

  const animes = useAppSelector((state) => {
    return Anime.redux.selectors.select(state, {
      include: {
        'anime-entry': isAuthenticated,
      },
      sort: {
        popularity: 'desc',
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
        popularity: 'desc',
      },
      limit: 10,
    });
  });

  useEffect(() => {
    const prepare = async () => {
      const [animes, mangas] = await Promise.all([
        Anime.find()
          .include({
            'anime-entry': isAuthenticated,
          })
          .sort({
            popularity: 'desc',
          }),
        Manga.find()
          .include({
            'manga-entry': isAuthenticated,
          })
          .sort({
            popularity: 'desc',
          }),
      ]);

      dispatch(Anime.redux.actions.setMany(animes));
      dispatch(Manga.redux.actions.setMany(mangas));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => notify.error('discover_load', err))
      .finally(() => setIsLoading(false));
  }, []);

  return { isLoading, animes, mangas };
};

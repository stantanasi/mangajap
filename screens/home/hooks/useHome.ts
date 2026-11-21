import { useEffect, useState } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';
import { Anime, AnimeEntry, Manga, MangaEntry, User } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import notify from '../../../utils/notify';

export const useHome = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);

  const animes = useAppSelector((state) => {
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
    })
      ?.map((entry) => entry.anime?.copy({
        'anime-entry': entry,
      }))
      .filter((anime) => !!anime)
      .filter((anime) => anime.progress < 100);
  });

  const mangas = useAppSelector((state) => {
    if (!user) {
      return undefined;
    }

    return User.redux.selectors.selectRelation(state, user.id, 'manga-library', {
      include: {
        manga: true,
      },
      sort: {
        updatedAt: 'desc',
      },
    })
      ?.map((entry) => entry.manga?.copy({
        'manga-entry': entry,
      }))
      .filter((manga) => !!manga)
      .filter((manga) => manga.progress < 100);
  });

  const latestAnimes = useAppSelector((state) => {
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

  const latestMangas = useAppSelector((state) => {
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
      if (user) {
        const animeLibrary = await User.findById(user.id).get('anime-library')
          .include({
            anime: true,
          })
          .sort({ updatedAt: 'desc' })
          .limit(500);

        dispatch(AnimeEntry.redux.actions.setMany(animeLibrary));
        dispatch(User.redux.actions.relations['anime-library'].addMany(user.id, animeLibrary));

        const mangaLibrary = await User.findById(user.id).get('manga-library')
          .include({
            manga: true,
          })
          .sort({ updatedAt: 'desc' })
          .limit(500);

        dispatch(MangaEntry.redux.actions.setMany(mangaLibrary));
        dispatch(User.redux.actions.relations['manga-library'].addMany(user.id, mangaLibrary));
      }

      const latestAnimes = await Anime.find()
        .include({
          'anime-entry': isAuthenticated,
        })
        .sort({
          createdAt: 'desc',
        });

      const latestMangas = await Manga.find()
        .include({
          'manga-entry': isAuthenticated,
        })
        .sort({
          createdAt: 'desc',
        });

      dispatch(Anime.redux.actions.setMany(latestAnimes));
      dispatch(Manga.redux.actions.setMany(latestMangas));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => notify.error('home_load', err))
      .finally(() => setIsLoading(false));
  }, [user]);

  return { isLoading, animes, mangas, latestAnimes, latestMangas };
};
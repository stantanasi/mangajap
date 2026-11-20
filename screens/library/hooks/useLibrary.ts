import { ComponentProps, useEffect, useState } from 'react';
import { AnimeEntry, MangaEntry, User } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import notify from '../../../utils/notify';
import LibraryScreen from '../LibraryScreen';

export const useLibrary = ({
  type,
  userId,
}: ComponentProps<typeof LibraryScreen>) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const library = useAppSelector((state) => {
    if (type === 'anime-library') {
      return User.redux.selectors.selectRelation(state, userId, 'anime-library', {
        include: {
          anime: true,
        },
        sort: {
          updatedAt: 'desc',
        },
      });
    } else if (type === 'anime-favorites') {
      return User.redux.selectors.selectRelation(state, userId, 'anime-favorites', {
        include: {
          anime: true,
        },
        sort: {
          updatedAt: 'desc',
        },
      });
    } else if (type === 'manga-library') {
      return User.redux.selectors.selectRelation(state, userId, 'manga-library', {
        include: {
          manga: true,
        },
        sort: {
          updatedAt: 'desc',
        },
      });
    } else if (type === 'manga-favorites') {
      return User.redux.selectors.selectRelation(state, userId, 'manga-favorites', {
        include: {
          manga: true,
        },
        sort: {
          updatedAt: 'desc',
        },
      });
    }

    return undefined;
  });

  useEffect(() => {
    const prepare = async () => {
      if (type === 'anime-library') {
        const animeLibrary = await User.findById(userId).get('anime-library')
          .include({ anime: true })
          .sort({ updatedAt: 'desc' })
          .limit(500);

        dispatch(AnimeEntry.redux.actions.setMany(animeLibrary));
        dispatch(User.redux.actions.relations['anime-library'].addMany(userId, animeLibrary));
      } else if (type === 'anime-favorites') {
        const animeFavorites = await User.findById(userId).get('anime-favorites')
          .include({ anime: true })
          .sort({ updatedAt: 'desc' })
          .limit(500);

        dispatch(AnimeEntry.redux.actions.setMany(animeFavorites));
        dispatch(User.redux.actions.relations['anime-favorites'].addMany(userId, animeFavorites));
      } else if (type === 'manga-library') {
        const mangaLibrary = await User.findById(userId).get('manga-library')
          .include({ manga: true })
          .sort({ updatedAt: 'desc' })
          .limit(500);

        dispatch(MangaEntry.redux.actions.setMany(mangaLibrary));
        dispatch(User.redux.actions.relations['manga-library'].addMany(userId, mangaLibrary));
      } else if (type === 'manga-favorites') {
        const mangaFavorites = await User.findById(userId).get('manga-favorites')
          .include({ manga: true })
          .sort({ updatedAt: 'desc' })
          .limit(500);

        dispatch(MangaEntry.redux.actions.setMany(mangaFavorites));
        dispatch(User.redux.actions.relations['manga-favorites'].addMany(userId, mangaFavorites));
      }
    };

    setIsLoading(true);
    prepare()
      .catch((err) => notify.error('library_load', err))
      .finally(() => setIsLoading(false));
  }, [type, userId]);

  return { isLoading, library };
};

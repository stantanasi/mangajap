import { ComponentProps, useEffect, useState } from 'react';
import { AnimeEntry, MangaEntry, User } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import LibraryScreen from '../LibraryScreen';

export const useLibrary = (params: ComponentProps<typeof LibraryScreen>['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const library = useAppSelector((state) => {
    if (params.type === 'anime-library') {
      return User.redux.selectors.selectRelation(state, params.userId, 'anime-library', {
        include: {
          anime: true,
        },
        sort: {
          updatedAt: 'desc',
        },
      });
    } else if (params.type === 'anime-favorites') {
      return User.redux.selectors.selectRelation(state, params.userId, 'anime-favorites', {
        include: {
          anime: true,
        },
        sort: {
          updatedAt: 'desc',
        },
      });
    } else if (params.type === 'manga-library') {
      return User.redux.selectors.selectRelation(state, params.userId, 'manga-library', {
        include: {
          manga: true,
        },
        sort: {
          updatedAt: 'desc',
        },
      });
    } else if (params.type === 'manga-favorites') {
      return User.redux.selectors.selectRelation(state, params.userId, 'manga-favorites', {
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
      if (params.type === 'anime-library') {
        const animeLibrary = await User.findById(params.userId).get('anime-library')
          .include({ anime: true })
          .sort({ updatedAt: 'desc' })
          .limit(500);

        dispatch(AnimeEntry.redux.actions.setMany(animeLibrary));
        dispatch(User.redux.actions.relations['anime-library'].addMany(params.userId, animeLibrary));
      } else if (params.type === 'anime-favorites') {
        const animeFavorites = await User.findById(params.userId).get('anime-favorites')
          .include({ anime: true })
          .sort({ updatedAt: 'desc' })
          .limit(500);

        dispatch(AnimeEntry.redux.actions.setMany(animeFavorites));
        dispatch(User.redux.actions.relations['anime-favorites'].addMany(params.userId, animeFavorites));
      } else if (params.type === 'manga-library') {
        const mangaLibrary = await User.findById(params.userId).get('manga-library')
          .include({ manga: true })
          .sort({ updatedAt: 'desc' })
          .limit(500);

        dispatch(MangaEntry.redux.actions.setMany(mangaLibrary));
        dispatch(User.redux.actions.relations['manga-library'].addMany(params.userId, mangaLibrary));
      } else if (params.type === 'manga-favorites') {
        const mangaFavorites = await User.findById(params.userId).get('manga-favorites')
          .include({ manga: true })
          .sort({ updatedAt: 'desc' })
          .limit(500);

        dispatch(MangaEntry.redux.actions.setMany(mangaFavorites));
        dispatch(User.redux.actions.relations['manga-favorites'].addMany(params.userId, mangaFavorites));
      }
    };

    setIsLoading(true);
    prepare()
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [params]);

  return { isLoading, library };
};

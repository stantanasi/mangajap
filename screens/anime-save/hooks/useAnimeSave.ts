import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { Anime, Genre, Theme } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import AnimeSaveScreen from '../AnimeSaveScreen';

export const useAnimeSave = (params: ComponentProps<typeof AnimeSaveScreen>['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const anime = (() => {
    if (!params) {
      return useMemo(() => new Anime({
        genres: [],
        themes: [],
      }), [params]);
    }

    return useAppSelector((state) => {
      return Anime.redux.selectors.selectById(state, params.id, {
        include: {
          genres: true,
          themes: true,
        },
      });
    });
  })();

  const genres = useAppSelector((state) => {
    return Genre.redux.selectors.select(state);
  });

  const themes = useAppSelector((state) => {
    return Genre.redux.selectors.select(state);
  });

  useEffect(() => {
    const prepare = async () => {
      if (params) {
        const anime = await Anime.findById(params.id)
          .include({
            genres: true,
            themes: true,
          });

        dispatch(Anime.redux.actions.setOne(anime));
      }

      const [genres, themes] = await Promise.all([
        Genre.find()
          .sort({
            name: 'asc',
          })
          .limit(1000),
        Theme.find()
          .sort({
            name: 'asc',
          })
          .limit(1000),
      ]);

      dispatch(Genre.redux.actions.setMany(genres));
      dispatch(Theme.redux.actions.setMany(themes));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [params]);

  return { isLoading, anime, genres, themes };
};

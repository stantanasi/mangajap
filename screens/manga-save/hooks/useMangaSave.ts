import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { Genre, Manga, Theme } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import notify from '../../../utils/notify';
import MangaSaveScreen from '../MangaSaveScreen';

export const useMangaSave = (params: ComponentProps<typeof MangaSaveScreen>['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const manga = (() => {
    if (!params) {
      return useMemo(() => new Manga({
        genres: [],
        themes: [],
      }), [params]);
    }

    return useAppSelector((state) => {
      return Manga.redux.selectors.selectById(state, params.id, {
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
    return Theme.redux.selectors.select(state);
  });

  useEffect(() => {
    const prepare = async () => {
      if (params) {
        const manga = await Manga.findById(params.id)
          .include({
            genres: true,
            themes: true,
          });

        dispatch(Manga.redux.actions.setOne(manga));
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
      .catch((err) => notify.error('manga_load', err))
      .finally(() => setIsLoading(false));
  }, [params]);

  return { isLoading, manga, genres, themes };
};

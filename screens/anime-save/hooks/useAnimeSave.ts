import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { Anime, Genre, Theme } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import notify from '../../../utils/notify';
import AnimeSaveScreen from '../AnimeSaveScreen';

export const useAnimeSave = ({
  animeId,
}: ComponentProps<typeof AnimeSaveScreen>) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const anime = (() => {
    if (!animeId) {
      return useMemo(() => new Anime({
        genres: [],
        themes: [],
      }), [animeId]);
    }

    return useAppSelector((state) => {
      return Anime.redux.selectors.selectById(state, animeId, {
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
      if (animeId) {
        const anime = await Anime.findById(animeId)
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
      .catch((err) => notify.error('anime_load', err))
      .finally(() => setIsLoading(false));
  }, [animeId]);

  return { isLoading, anime, genres, themes };
};

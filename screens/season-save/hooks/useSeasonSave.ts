import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { Anime, Season } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import notify from '../../../utils/notify';
import SeasonSaveScreen from '../SeasonSaveScreen';

export const useSeasonSave = ({
  animeId,
  seasonId,
}: ComponentProps<typeof SeasonSaveScreen>) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const season = (() => {
    if (!seasonId) {
      return useMemo(() => new Season({
        anime: new Anime({ id: animeId }),
        episodes: [],
      }), [animeId, seasonId]);
    }

    return useAppSelector((state) => {
      return Season.redux.selectors.selectById(state, seasonId!);
    });
  })();

  useEffect(() => {
    const prepare = async () => {
      if (!seasonId) return;

      const season = await Season.findById(seasonId);

      dispatch(Season.redux.actions.setOne(season));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => notify.error('season_load', err))
      .finally(() => setIsLoading(false));
  }, [animeId, seasonId]);

  return { isLoading, season };
};

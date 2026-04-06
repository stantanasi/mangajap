import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Anime, Season } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import SeasonSaveScreen from '../SeasonSaveScreen';

export const useSeasonSave = (params: ComponentProps<typeof SeasonSaveScreen>['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const season = (() => {
    if ('animeId' in params) {
      return useMemo(() => new Season({
        anime: new Anime({ id: params.animeId }),
        episodes: [],
      }), [params]);
    }

    return useAppSelector((state) => {
      return Season.redux.selectors.selectById(state, params.seasonId);
    });
  })();

  useEffect(() => {
    const prepare = async () => {
      if (!('seasonId' in params)) return;

      const season = await Season.findById(params.seasonId);

      dispatch(Season.redux.actions.setOne(season));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => {
        console.error(err);
        toast.error("Échec de la récupération des données", {
          description: err.message || "Une erreur inattendue s'est produite",
        });
      })
      .finally(() => setIsLoading(false));
  }, [params]);

  return { isLoading, season };
};

import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Anime, Franchise, Manga } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import FranchiseSaveScreen from '../FranchiseSaveScreen';

export const useFranchiseSave = (params: ComponentProps<typeof FranchiseSaveScreen>['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const franchise = (() => {
    if ('animeId' in params) {
      return useMemo(() => new Franchise({
        source: new Anime({ id: params.animeId }),
      }), [params]);
    } else if ('mangaId' in params) {
      return useMemo(() => new Franchise({
        source: new Manga({ id: params.mangaId }),
      }), [params]);
    }

    return useAppSelector((state) => {
      return Franchise.redux.selectors.selectById(state, params.franchiseId, {
        include: {
          destination: true,
        },
      });
    });
  })();

  useEffect(() => {
    const prepare = async () => {
      if (!('franchiseId' in params)) return;

      const franchise = await Franchise.findById(params.franchiseId)
        .include({ destination: true });

      dispatch(Franchise.redux.actions.setOne(franchise));
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

  return { isLoading, franchise };
};

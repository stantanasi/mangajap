import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { Anime, Franchise, Manga } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import notify from '../../../utils/notify';
import FranchiseSaveScreen from '../FranchiseSaveScreen';

export const useFranchiseSave = ({
  animeId,
  mangaId,
  franchiseId,
}: ComponentProps<typeof FranchiseSaveScreen>) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const franchise = (() => {
    if (!franchiseId) {
      return useMemo(() => new Franchise({
        source: animeId ? new Anime({ id: animeId })
          : mangaId ? new Manga({ id: mangaId })
            : undefined,
      }), [animeId, mangaId]);
    }

    return useAppSelector((state) => {
      return Franchise.redux.selectors.selectById(state, franchiseId, {
        include: {
          destination: true,
        },
      });
    });
  })();

  useEffect(() => {
    const prepare = async () => {
      if (!franchiseId) return;

      const franchise = await Franchise.findById(franchiseId)
        .include({ destination: true });

      dispatch(Franchise.redux.actions.setOne(franchise));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => notify.error('franchise_load', err))
      .finally(() => setIsLoading(false));
  }, [animeId, mangaId, franchiseId]);

  return { isLoading, franchise };
};

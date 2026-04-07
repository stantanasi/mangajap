import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { Anime, Manga, Staff } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import notify from '../../../utils/notify';
import StaffSaveScreen from '../StaffSaveScreen';

export const useStaffSave = (params: ComponentProps<typeof StaffSaveScreen>['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const staff = (() => {
    if ('animeId' in params) {
      return useMemo(() => new Staff({
        anime: new Anime({ id: params.animeId }),
      }), [params]);
    } else if ('mangaId' in params) {
      return useMemo(() => new Staff({
        manga: new Manga({ id: params.mangaId }),
      }), [params]);
    }

    return useAppSelector((state) => {
      return Staff.redux.selectors.selectById(state, params.staffId, {
        include: {
          people: true,
        },
      });
    });
  })();

  useEffect(() => {
    const prepare = async () => {
      if (!('staffId' in params)) return;

      const staff = await Staff.findById(params.staffId)
        .include({ people: true });

      dispatch(Staff.redux.actions.setOne(staff));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => notify.error('staff_load', err))
      .finally(() => setIsLoading(false));
  }, [params]);

  return { isLoading, staff };
};

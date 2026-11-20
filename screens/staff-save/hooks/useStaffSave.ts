import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { Anime, Manga, Staff } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import notify from '../../../utils/notify';
import StaffSaveScreen from '../StaffSaveScreen';

export const useStaffSave = ({
  animeId,
  mangaId,
  staffId,
}: ComponentProps<typeof StaffSaveScreen>) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const staff = (() => {
    if (!staffId) {
      return useMemo(() => new Staff({
        anime: animeId && new Anime({ id: animeId }),
        manga: mangaId && new Manga({ id: mangaId }),
      }), [animeId, mangaId]);
    }

    return useAppSelector((state) => {
      return Staff.redux.selectors.selectById(state, staffId, {
        include: {
          people: true,
        },
      });
    });
  })();

  useEffect(() => {
    const prepare = async () => {
      if (!staffId) return;

      const staff = await Staff.findById(staffId)
        .include({ people: true });

      dispatch(Staff.redux.actions.setOne(staff));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => notify.error('staff_load', err))
      .finally(() => setIsLoading(false));
  }, [animeId, mangaId, staffId]);

  return { isLoading, staff };
};

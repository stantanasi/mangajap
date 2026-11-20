import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { Manga, Volume } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import notify from '../../../utils/notify';
import VolumeSaveScreen from '../VolumeSaveScreen';

export const useVolumeSave = ({
  mangaId,
  volumeId,
}: ComponentProps<typeof VolumeSaveScreen>) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const volume = (() => {
    if (!volumeId) {
      return useMemo(() => new Volume({
        manga: new Manga({ id: mangaId }),
        chapters: [],
      }), [mangaId]);
    }

    return useAppSelector((state) => {
      return Volume.redux.selectors.selectById(state, volumeId);
    });
  })();

  useEffect(() => {
    const prepare = async () => {
      if (!volumeId) return;

      const volume = await Volume.findById(volumeId);

      dispatch(Volume.redux.actions.setOne(volume));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => notify.error('volume_load', err))
      .finally(() => setIsLoading(false));
  }, [mangaId, volumeId]);

  return { isLoading, volume };
};

import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Manga, Volume } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import VolumeSaveScreen from '../VolumeSaveScreen';

export const useVolumeSave = (params: ComponentProps<typeof VolumeSaveScreen>['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const volume = (() => {
    if ('mangaId' in params) {
      return useMemo(() => new Volume({
        manga: new Manga({ id: params.mangaId }),
        chapters: [],
      }), [params]);
    }

    return useAppSelector((state) => {
      return Volume.redux.selectors.selectById(state, params.volumeId);
    });
  })();

  useEffect(() => {
    const prepare = async () => {
      if (!('volumeId' in params)) return;

      const volume = await Volume.findById(params.volumeId);

      dispatch(Volume.redux.actions.setOne(volume));
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

  return { isLoading, volume };
};

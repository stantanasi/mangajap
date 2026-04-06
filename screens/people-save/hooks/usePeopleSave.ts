import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { People } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import PeopleSaveScreen from '../PeopleSaveScreen';

export const usePeopleSave = (params: ComponentProps<typeof PeopleSaveScreen>['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const people = (() => {
    if (!params) {
      return useMemo(() => new People(), [params]);
    }

    return useAppSelector((state) => {
      return People.redux.selectors.selectById(state, params.peopleId);
    });
  })();

  useEffect(() => {
    const prepare = async () => {
      if (!params) return;

      const people = await People.findById(params.peopleId);

      dispatch(People.redux.actions.setOne(people));
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

  return { isLoading, people };
};

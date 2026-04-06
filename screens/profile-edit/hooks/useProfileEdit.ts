import { ComponentProps, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { User } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import ProfileEditScreen from '../ProfileEditScreen';

export const useProfileEdit = (params: ComponentProps<typeof ProfileEditScreen>['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const user = useAppSelector((state) => {
    return User.redux.selectors.selectById(state, params.id);
  });

  useEffect(() => {
    const prepare = async () => {
      const user = await User.findById(params.id);

      dispatch(User.redux.actions.setOne(user));
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

  return { isLoading, user };
};

import { ComponentProps, useEffect, useState } from 'react';
import { User } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import notify from '../../../utils/notify';
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
      .catch((err) => notify.error('profile_load', err))
      .finally(() => setIsLoading(false));
  }, [params]);

  return { isLoading, user };
};

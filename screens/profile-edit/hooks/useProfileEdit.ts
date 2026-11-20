import { useEffect, useState } from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';
import { User } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import notify from '../../../utils/notify';

export const useProfileEdit = () => {
  const dispatch = useAppDispatch();
  const { user: authenticatedUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);

  const user = useAppSelector((state) => {
    if (!authenticatedUser) return undefined;

    return User.redux.selectors.selectById(state, authenticatedUser.id);
  });

  useEffect(() => {
    const prepare = async () => {
      if (!authenticatedUser) return;

      const user = await User.findById(authenticatedUser.id);

      dispatch(User.redux.actions.setOne(user));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => notify.error('profile_load', err))
      .finally(() => setIsLoading(false));
  }, [authenticatedUser]);

  return { isLoading, user };
};

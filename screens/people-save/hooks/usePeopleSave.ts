import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { People } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import notify from '../../../utils/notify';
import PeopleSaveScreen from '../PeopleSaveScreen';

export const usePeopleSave = ({
  peopleId,
}: ComponentProps<typeof PeopleSaveScreen>) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const people = (() => {
    if (!peopleId) {
      return useMemo(() => new People(
      ), [peopleId]);
    }

    return useAppSelector((state) => {
      return People.redux.selectors.selectById(state, peopleId);
    });
  })();

  useEffect(() => {
    const prepare = async () => {
      if (!peopleId) return;

      const people = await People.findById(peopleId);

      dispatch(People.redux.actions.setOne(people));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => notify.error('people_load', err))
      .finally(() => setIsLoading(false));
  }, [peopleId]);

  return { isLoading, people };
};

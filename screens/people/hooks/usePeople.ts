import { ComponentProps, useEffect, useState } from 'react';
import { People } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import PeopleScreen from '../PeopleScreen';

export const usePeople = (params: ComponentProps<typeof PeopleScreen>['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const people = useAppSelector((state) => {
    return People.redux.selectors.selectById(state, params.id, {
      include: {
        staff: {
          include: {
            anime: true,
            manga: true,
          },
        },
      },
    });
  });

  useEffect(() => {
    const prepare = async () => {
      const people = await People.findById(params.id)
        .include({
          staff: {
            anime: true,
            manga: true,
          },
        });

      dispatch(People.redux.actions.setOne(people));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [params]);

  return { isLoading, people };
};

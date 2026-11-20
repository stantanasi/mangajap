import { ComponentProps, useEffect, useState } from 'react';
import { People } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import notify from '../../../utils/notify';
import PeopleScreen from '../PeopleScreen';

export const usePeople = ({
  peopleId,
}: ComponentProps<typeof PeopleScreen>) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const people = useAppSelector((state) => {
    return People.redux.selectors.selectById(state, peopleId, {
      include: {
        'anime-staff': {
          include: {
            anime: true,
          },
        },
        'manga-staff': {
          include: {
            manga: true,
          },
        },
      },
    });
  });

  useEffect(() => {
    const prepare = async () => {
      const people = await People.findById(peopleId)
        .include({
          'anime-staff': {
            anime: true,
          },
          'manga-staff': {
            manga: true,
          },
        });

      dispatch(People.redux.actions.setOne(people));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => notify.error('people_load', err))
      .finally(() => setIsLoading(false));
  }, [peopleId]);

  return { isLoading, people };
};

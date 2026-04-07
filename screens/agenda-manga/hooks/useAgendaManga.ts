import { ComponentProps, useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { MangaEntry, User } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import notify from '../../../utils/notify';
import AgendaMangaScreen from '../AgendaMangaScreen';

export const useAgendaManga = (params: ComponentProps<typeof AgendaMangaScreen>['route']['params']) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const mangaLibrary = useAppSelector((state) => {
    if (!user) {
      return undefined;
    }

    return User.redux.selectors.selectRelation(state, user.id, 'manga-library', {
      include: {
        manga: true,
      },
      sort: {
        updatedAt: 'desc',
      },
    });
  });

  useEffect(() => {
    const prepare = async () => {
      if (!user) return;

      const mangaLibrary = await User.findById(user.id).get('manga-library')
        .include({
          manga: true,
        })
        .sort({ updatedAt: 'desc' })
        .limit(500);

      dispatch(MangaEntry.redux.actions.setMany(mangaLibrary));
      dispatch(User.redux.actions.relations['manga-library'].addMany(user.id, mangaLibrary));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => notify.error('agenda_manga_load', err))
      .finally(() => setIsLoading(false));
  }, [user]);

  return { isLoading, mangaLibrary };
};

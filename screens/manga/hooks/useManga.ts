import { ComponentProps, useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Manga } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import notify from '../../../utils/notify';
import MangaScreen from '../MangaScreen';

export const useManga = (params: ComponentProps<typeof MangaScreen>['route']['params']) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const manga = useAppSelector((state) => {
    return Manga.redux.selectors.selectById(state, params.id, {
      include: {
        genres: true,
        themes: true,
        volumes: {
          include: {
            chapters: {
              include: {
                'chapter-entry': isAuthenticated,
              },
            },
            'volume-entry': isAuthenticated,
          },
          sort: {
            number: 'asc',
          },
        },
        chapters: {
          include: {
            'chapter-entry': isAuthenticated,
          },
          sort: {
            number: 'asc',
          },
        },
        staff: {
          include: {
            people: true,
          },
        },
        franchises: {
          include: {
            destination: true,
          },
        },
        'manga-entry': isAuthenticated,
      },
    });
  });

  useEffect(() => {
    const prepare = async () => {
      const manga = await Manga.findById(params.id)
        .include({
          genres: true,
          themes: true,
          volumes: {
            chapters: {
              'chapter-entry': isAuthenticated,
            },
            'volume-entry': isAuthenticated,
          },
          chapters: {
            'chapter-entry': isAuthenticated,
          },
          staff: {
            people: true,
          },
          franchises: {
            destination: true,
          },
          'manga-entry': isAuthenticated,
        });

      dispatch(Manga.redux.actions.setOne(manga));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => notify.error('manga_load', err))
      .finally(() => setIsLoading(false));
  }, [params]);

  return { isLoading, manga };
};

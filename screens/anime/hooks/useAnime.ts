import { ComponentProps, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';
import { Anime } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import AnimeScreen from '../AnimeScreen';

export const useAnime = (params: ComponentProps<typeof AnimeScreen>['route']['params']) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const anime = useAppSelector((state) => {
    return Anime.redux.selectors.selectById(state, params.id, {
      include: {
        genres: true,
        themes: true,
        seasons: {
          include: {
            episodes: {
              include: {
                'episode-entry': isAuthenticated,
              },
              sort: {
                number: 'asc',
              },
            },
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
        'anime-entry': isAuthenticated,
      },
    });
  });

  useEffect(() => {
    const prepare = async () => {
      const anime = await Anime.findById(params.id)
        .include({
          genres: true,
          themes: true,
          seasons: {
            episodes: {
              'episode-entry': isAuthenticated,
            },
          },
          staff: {
            people: true,
          },
          franchises: {
            destination: true,
          },
          'anime-entry': isAuthenticated,
        });

      dispatch(Anime.redux.actions.setOne(anime));
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

  return { isLoading, anime };
};

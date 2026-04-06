import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Anime, Episode, Season } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import EpisodeSaveScreen from '../EpisodeSaveScreen';

export const useEpisodeSave = (params: ComponentProps<typeof EpisodeSaveScreen>['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const episode = (() => {
    if ('animeId' in params) {
      return useMemo(() => new Episode({
        anime: new Anime({ id: params.animeId }),
      }), [params]);
    }

    return useAppSelector((state) => {
      return Episode.redux.selectors.selectById(state, params.episodeId, {
        include: {
          anime: true,
          season: true,
        },
      });
    });
  })();

  const seasons = useAppSelector((state) => {
    if (!episode || !episode.anime) return undefined;
    return Anime.redux.selectors.selectRelation(state, episode.anime.id, 'seasons');
  });

  useEffect(() => {
    const prepare = async () => {
      if ('animeId' in params) {
        const seasons = await Anime.findById(params.animeId).get('seasons')
          .limit(1000);

        dispatch(Season.redux.actions.setMany(seasons));
        dispatch(Anime.redux.actions.relations.seasons.addMany(params.animeId, seasons));
      } else {
        const episode = await Episode.findById(params.episodeId)
          .include({
            anime: {
              seasons: true,
            },
            season: true,
          });

        dispatch(Episode.redux.actions.setOne(episode));
      }
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

  return { isLoading, episode, seasons };
};

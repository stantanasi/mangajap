import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { Anime, Episode, Season } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import EpisodeSaveScreen from '../EpisodeSaveScreen';

export const useEpisodeSave = (params: ComponentProps<typeof EpisodeSaveScreen>['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSeasons, setIsLoadingSeasons] = useState(true);

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
    const loadSeasons = async () => {
      if ('animeId' in params) {
        const seasons = await Anime.findById(params.animeId).get('seasons')
          .limit(1000);

        dispatch(Season.redux.actions.setMany(seasons));
        dispatch(Anime.redux.actions.relations.seasons.addMany(params.animeId, seasons));
      }
    };

    const prepare = async () => {
      if ('episodeId' in params) {
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
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));

    setIsLoadingSeasons(true);
    loadSeasons()
      .catch((err) => console.error(err))
      .finally(() => setIsLoadingSeasons(false));
  }, [params]);

  return { isLoading, isLoadingSeasons, episode, seasons };
};

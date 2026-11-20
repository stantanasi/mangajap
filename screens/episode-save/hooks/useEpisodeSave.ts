import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { Anime, Episode, Season } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import notify from '../../../utils/notify';
import EpisodeSaveScreen from '../EpisodeSaveScreen';

export const useEpisodeSave = ({
  animeId,
  episodeId,
}: ComponentProps<typeof EpisodeSaveScreen>) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const episode = (() => {
    if (!episodeId) {
      return useMemo(() => new Episode({
        anime: new Anime({ id: animeId }),
      }), [animeId, episodeId]);
    }

    return useAppSelector((state) => {
      return Episode.redux.selectors.selectById(state, episodeId, {
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
      if (!episodeId) {
        const seasons = await Anime.findById(animeId).get('seasons')
          .limit(1000);

        dispatch(Season.redux.actions.setMany(seasons));
        dispatch(Anime.redux.actions.relations.seasons.addMany(animeId, seasons));
      } else {
        const episode = await Episode.findById(episodeId)
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
      .catch((err) => notify.error('episode_load', err))
      .finally(() => setIsLoading(false));
  }, [animeId, episodeId]);

  return { isLoading, episode, seasons };
};

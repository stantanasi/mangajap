import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { Chapter, Manga, Volume } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import ChapterSaveScreen from '../ChapterSaveScreen';

export const useChapterSave = (params: ComponentProps<typeof ChapterSaveScreen>['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const chapter = (() => {
    if ('mangaId' in params) {
      return useMemo(() => new Chapter({
        manga: new Manga({ id: params.mangaId }),
      }), [params]);
    }

    return useAppSelector((state) => {
      return Chapter.redux.selectors.selectById(state, params.chapterId, {
        include: {
          manga: true,
          volume: true,
        },
      });
    });
  })();

  const volumes = useAppSelector((state) => {
    if (!chapter || !chapter.manga) return undefined;
    return Manga.redux.selectors.selectRelation(state, chapter.manga.id, 'volumes');
  });

  useEffect(() => {
    const prepare = async () => {
      if ('mangaId' in params) {
        const volumes = await Manga.findById(params.mangaId).get('volumes')
          .limit(1000);

        dispatch(Volume.redux.actions.setMany(volumes));
        dispatch(Manga.redux.actions.relations.volumes.addMany(params.mangaId, volumes));
      } else {
        const chapter = await Chapter.findById(params.chapterId)
          .include({
            manga: {
              volumes: true,
            },
            volume: true,
          });

        dispatch(Chapter.redux.actions.setOne(chapter));
      }

    };

    setIsLoading(true);
    prepare()
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [params]);

  return { isLoading, chapter, volumes };
};

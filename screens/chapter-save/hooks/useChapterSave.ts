import { ComponentProps, useEffect, useMemo, useState } from 'react';
import { Chapter, Manga, Volume } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import notify from '../../../utils/notify';
import ChapterSaveScreen from '../ChapterSaveScreen';

export const useChapterSave = ({
  mangaId,
  chapterId,
}: ComponentProps<typeof ChapterSaveScreen>) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const chapter = (() => {
    if (!chapterId) {
      return useMemo(() => new Chapter({
        manga: new Manga({ id: mangaId }),
      }), [mangaId]);
    }

    return useAppSelector((state) => {
      return Chapter.redux.selectors.selectById(state, chapterId, {
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
      if (!chapterId) {
        const volumes = await Manga.findById(mangaId).get('volumes')
          .limit(1000);

        dispatch(Volume.redux.actions.setMany(volumes));
        dispatch(Manga.redux.actions.relations.volumes.addMany(mangaId, volumes));
      } else {
        const chapter = await Chapter.findById(chapterId)
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
      .catch((err) => notify.error('chapter_load', err))
      .finally(() => setIsLoading(false));
  }, [mangaId, chapterId]);

  return { isLoading, chapter, volumes };
};

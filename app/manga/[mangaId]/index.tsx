import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import { Manga } from '../../../models';
import { useAppSelector } from '../../../redux/store';
import MangaScreen from '../../../screens/manga/MangaScreen';

type Params = {
  mangaId: string;
};

export default function MangaPage() {
  const params = useLocalSearchParams<Params>();
  const manga = useAppSelector((state) => {
    return Manga.redux.selectors.selectById(state, params.mangaId);
  });

  return (
    <>
      <Head>
        <title>{manga && `${manga.title} - Manga | MangaJap`}</title>
      </Head>

      <MangaScreen mangaId={params.mangaId} />
    </>
  );
}

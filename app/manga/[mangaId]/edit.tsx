import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import AuthGuard from '../../../guards/AuthGuard';
import { Manga } from '../../../models';
import { useAppSelector } from '../../../redux/store';
import MangaSaveScreen from '../../../screens/manga-save/MangaSaveScreen';

type Params = {
  mangaId: string;
};

export default function MangaUpdatePage() {
  const params = useLocalSearchParams<Params>();
  const manga = useAppSelector((state) => {
    return Manga.redux.selectors.selectById(state, params.mangaId);
  });

  return (
    <AuthGuard>
      <Head>
        <title>{manga && `Modifier - ${manga.title} - Manga | MangaJap`}</title>
      </Head>

      <MangaSaveScreen mangaId={params.mangaId} />
    </AuthGuard>
  );
}

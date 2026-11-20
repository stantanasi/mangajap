import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import AuthGuard from '../../../../guards/AuthGuard';
import ChapterSaveScreen from '../../../../screens/chapter-save/ChapterSaveScreen';

type Params = {
  mangaId: string;
};

export default function MangaChapterCreatePage() {
  const params = useLocalSearchParams<Params>();

  return (
    <AuthGuard>
      <Head>
        <title>Ajouter un chapitre | MangaJap</title>
      </Head>

      <ChapterSaveScreen mangaId={params.mangaId} />
    </AuthGuard>
  );
}

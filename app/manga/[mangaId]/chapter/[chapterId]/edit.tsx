import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import AuthGuard from '../../../../../guards/AuthGuard';
import ChapterSaveScreen from '../../../../../screens/chapter-save/ChapterSaveScreen';

type Params = {
  mangaId: string;
  chapterId: string;
};

export default function MangaChapterUpdatePage() {
  const params = useLocalSearchParams<Params>();

  return (
    <AuthGuard>
      <Head>
        <title>Modifier le chapitre | MangaJap</title>
      </Head>

      <ChapterSaveScreen mangaId={params.mangaId} chapterId={params.chapterId} />
    </AuthGuard>
  );
}

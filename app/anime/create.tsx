import Head from 'expo-router/head';
import AuthGuard from '../../guards/AuthGuard';
import AnimeSaveScreen from '../../screens/anime-save/AnimeSaveScreen';

export default function AnimeCreatePage() {
  return (
    <AuthGuard>
      <Head>
        <title>Ajouter un anime | MangaJap</title>
      </Head>

      <AnimeSaveScreen />
    </AuthGuard>
  );
}

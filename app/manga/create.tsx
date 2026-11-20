import Head from 'expo-router/head';
import AuthGuard from '../../guards/AuthGuard';
import MangaSaveScreen from '../../screens/manga-save/MangaSaveScreen';

export default function MangaCreatePage() {
  return (
    <AuthGuard>
      <Head>
        <title>Ajouter un manga | MangaJap</title>
      </Head>

      <MangaSaveScreen />
    </AuthGuard>
  );
}

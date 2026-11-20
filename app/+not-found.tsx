import Head from 'expo-router/head';
import NotFoundScreen from '../screens/not-found/NotFoundScreen';

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>Page non trouvée | MangaJap</title>
      </Head>

      <NotFoundScreen />
    </>
  );
}

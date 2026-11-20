import Head from 'expo-router/head';
import DiscoverScreen from '../../screens/discover/DiscoverScreen';

export default function DiscoverPage() {
  return (
    <>
      <Head>
        <title>Découvrir | MangaJap</title>
      </Head>

      <DiscoverScreen />
    </>
  );
}
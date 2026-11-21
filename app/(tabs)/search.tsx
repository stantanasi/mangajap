import Head from 'expo-router/head';
import SearchScreen from '../../screens/search/SearchScreen';

export default function SearchPage() {
  return (
    <>
      <Head>
        <title>Rechercher | MangaJap</title>
      </Head>

      <SearchScreen />
    </>
  );
}
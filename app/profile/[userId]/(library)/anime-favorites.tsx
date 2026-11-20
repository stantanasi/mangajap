import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import LibraryScreen from '../../../../screens/library/LibraryScreen';

type Params = {
  userId: string;
};

export default function UserAnimeFavoritesPage() {
  const params = useLocalSearchParams<Params>();

  return (
    <>
      <Head>
        <title>Animes favoris | MangaJap</title>
      </Head>

      <LibraryScreen type="anime-favorites" userId={params.userId} />
    </>
  );
}

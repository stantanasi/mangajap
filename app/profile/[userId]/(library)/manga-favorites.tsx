import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import LibraryScreen from '../../../../screens/library/LibraryScreen';

type Params = {
  userId: string;
};

export default function UserMangaFavoritesPage() {
  const params = useLocalSearchParams<Params>();

  return (
    <>
      <Head>
        <title>Manga favoris | MangaJap</title>
      </Head>

      <LibraryScreen type="manga-favorites" userId={params.userId} />
    </>
  );
}

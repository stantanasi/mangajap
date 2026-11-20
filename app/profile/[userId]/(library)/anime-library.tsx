import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import LibraryScreen from '../../../../screens/library/LibraryScreen';

type Params = {
  userId: string;
};

export default function UserAnimeLibraryPage() {
  const params = useLocalSearchParams<Params>();

  return (
    <>
      <Head>
        <title>Bibliothèque animes | MangaJap</title>
      </Head>

      <LibraryScreen type="anime-library" userId={params.userId} />
    </>
  );
}

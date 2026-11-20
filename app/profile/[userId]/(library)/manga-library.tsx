import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import LibraryScreen from '../../../../screens/library/LibraryScreen';

type Params = {
  userId: string;
};

export default function UserMangaLibraryPage() {
  const params = useLocalSearchParams<Params>();

  return (
    <>
      <Head>
        <title>Bibliothèque mangas | MangaJap</title>
      </Head>

      <LibraryScreen type="manga-library" userId={params.userId} />
    </>
  );
}

import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import AuthGuard from '../../../../guards/AuthGuard';
import SeasonSaveScreen from '../../../../screens/season-save/SeasonSaveScreen';

type Params = {
  animeId: string;
};

export default function AnimeSeasonCreatePage() {
  const params = useLocalSearchParams<Params>();

  return (
    <AuthGuard>
      <Head>
        <title>Ajouter une saison | MangaJap</title>
      </Head>

      <SeasonSaveScreen animeId={params.animeId} />
    </AuthGuard>
  );
}

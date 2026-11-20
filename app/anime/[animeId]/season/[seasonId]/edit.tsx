import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import AuthGuard from '../../../../../guards/AuthGuard';
import SeasonSaveScreen from '../../../../../screens/season-save/SeasonSaveScreen';

type Params = {
  animeId: string;
  seasonId: string;
};

export default function AnimeSeasonUpdatePage() {
  const params = useLocalSearchParams<Params>();

  return (
    <AuthGuard>
      <Head>
        <title>Modifier la saison | MangaJap</title>
      </Head>

      <SeasonSaveScreen animeId={params.animeId} seasonId={params.seasonId} />
    </AuthGuard>
  );
}

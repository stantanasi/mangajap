import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import AuthGuard from '../../../../guards/AuthGuard';
import EpisodeSaveScreen from '../../../../screens/episode-save/EpisodeSaveScreen';

type Params = {
  animeId: string;
};

export default function AnimeEpisodeCreatePage() {
  const params = useLocalSearchParams<Params>();

  return (
    <AuthGuard>
      <Head>
        <title>Ajouter un épisode | MangaJap</title>
      </Head>

      <EpisodeSaveScreen animeId={params.animeId} />
    </AuthGuard>
  );
}

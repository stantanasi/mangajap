import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import AuthGuard from '../../../../../guards/AuthGuard';
import EpisodeSaveScreen from '../../../../../screens/episode-save/EpisodeSaveScreen';

type Params = {
  animeId: string;
  episodeId: string;
};

export default function AnimeEpisodeUpdatePage() {
  const params = useLocalSearchParams<Params>();

  return (
    <AuthGuard>
      <Head>
        <title>Modifier l'épisode | MangaJap</title>
      </Head>

      <EpisodeSaveScreen animeId={params.animeId} episodeId={params.episodeId} />
    </AuthGuard>
  );
}

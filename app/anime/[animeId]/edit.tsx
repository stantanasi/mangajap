import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import AuthGuard from '../../../guards/AuthGuard';
import { Anime } from '../../../models';
import { useAppSelector } from '../../../redux/store';
import AnimeSaveScreen from '../../../screens/anime-save/AnimeSaveScreen';

type Params = {
  animeId: string;
};

export default function AnimeUpdatePage() {
  const params = useLocalSearchParams<Params>();
  const anime = useAppSelector((state) => {
    return Anime.redux.selectors.selectById(state, params.animeId);
  });

  return (
    <AuthGuard>
      <Head>
        <title>{anime && `Modifier - ${anime.title} - Anime | MangaJap`}</title>
      </Head>

      <AnimeSaveScreen animeId={params.animeId} />
    </AuthGuard>
  );
}

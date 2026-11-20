import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import { Anime } from '../../../models';
import { useAppSelector } from '../../../redux/store';
import AnimeScreen from '../../../screens/anime/AnimeScreen';

type Params = {
  animeId: string;
};

export default function AnimePage() {
  const params = useLocalSearchParams<Params>();
  const anime = useAppSelector((state) => {
    return Anime.redux.selectors.selectById(state, params.animeId);
  });

  return (
    <>
      <Head>
        <title>{anime && `${anime.title} - Anime | MangaJap`}</title>
      </Head>

      <AnimeScreen animeId={params.animeId} />
    </>
  );
}

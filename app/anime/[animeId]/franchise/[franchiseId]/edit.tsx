import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import AuthGuard from '../../../../../guards/AuthGuard';
import FranchiseSaveScreen from '../../../../../screens/franchise-save/FranchiseSaveScreen';

type Params = {
  animeId: string;
  franchiseId: string;
};

export default function AnimeFranchiseUpdatePage() {
  const params = useLocalSearchParams<Params>();

  return (
    <AuthGuard>
      <Head>
        <title>Modifier la franchise - Anime | MangaJap</title>
      </Head>

      <FranchiseSaveScreen animeId={params.animeId} franchiseId={params.franchiseId} />
    </AuthGuard>
  );
}

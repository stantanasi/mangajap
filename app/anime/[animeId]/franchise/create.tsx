import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import AuthGuard from '../../../../guards/AuthGuard';
import FranchiseSaveScreen from '../../../../screens/franchise-save/FranchiseSaveScreen';

type Params = {
  animeId: string;
};

export default function AnimeFranchiseCreatePage() {
  const params = useLocalSearchParams<Params>();

  return (
    <AuthGuard>
      <Head>
        <title>Ajouter une franchise - Anime | MangaJap</title>
      </Head>

      <FranchiseSaveScreen animeId={params.animeId} />
    </AuthGuard>
  );
}

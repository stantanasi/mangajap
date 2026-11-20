import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import AuthGuard from '../../../../../guards/AuthGuard';
import FranchiseSaveScreen from '../../../../../screens/franchise-save/FranchiseSaveScreen';

type Params = {
  mangaId: string;
  franchiseId: string;
};

export default function MangaFranchiseUpdatePage() {
  const params = useLocalSearchParams<Params>();

  return (
    <AuthGuard>
      <Head>
        <title>Modifier la franchise - Manga | MangaJap</title>
      </Head>

      <FranchiseSaveScreen mangaId={params.mangaId} franchiseId={params.franchiseId} />
    </AuthGuard>
  );
}

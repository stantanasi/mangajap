import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import AuthGuard from '../../../../guards/AuthGuard';
import FranchiseSaveScreen from '../../../../screens/franchise-save/FranchiseSaveScreen';

type Params = {
  mangaId: string;
};

export default function MangaFranchiseCreatePage() {
  const params = useLocalSearchParams<Params>();

  return (
    <AuthGuard>
      <Head>
        <title>Ajouter une franchise - Manga | MangaJap</title>
      </Head>

      <FranchiseSaveScreen mangaId={params.mangaId} />
    </AuthGuard>
  );
}

import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import AuthGuard from '../../../../guards/AuthGuard';
import StaffSaveScreen from '../../../../screens/staff-save/StaffSaveScreen';

type Params = {
  mangaId: string;
};

export default function MangaStaffCreatePage() {
  const params = useLocalSearchParams<Params>();

  return (
    <AuthGuard>
      <Head>
        <title>Ajouter un staff - Manga | MangaJap</title>
      </Head>

      <StaffSaveScreen mangaId={params.mangaId} />
    </AuthGuard>
  );
}

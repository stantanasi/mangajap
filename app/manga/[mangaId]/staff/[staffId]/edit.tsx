import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import AuthGuard from '../../../../../guards/AuthGuard';
import StaffSaveScreen from '../../../../../screens/staff-save/StaffSaveScreen';

type Params = {
  mangaId: string;
  staffId: string;
};

export default function MangaStaffUpdatePage() {
  const params = useLocalSearchParams<Params>();

  return (
    <AuthGuard>
      <Head>
        <title>Modifier le staff - Manga | MangaJap</title>
      </Head>

      <StaffSaveScreen mangaId={params.mangaId} staffId={params.staffId} />
    </AuthGuard>
  );
}

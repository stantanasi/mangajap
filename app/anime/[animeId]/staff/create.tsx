import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import AuthGuard from '../../../../guards/AuthGuard';
import StaffSaveScreen from '../../../../screens/staff-save/StaffSaveScreen';

type Params = {
  animeId: string;
};

export default function AnimeStaffUpdatePage() {
  const params = useLocalSearchParams<Params>();

  return (
    <AuthGuard>
      <Head>
        <title>Ajouter un staff - Anime | MangaJap</title>
      </Head>

      <StaffSaveScreen animeId={params.animeId} />
    </AuthGuard>
  );
}

import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import AuthGuard from '../../../../../guards/AuthGuard';
import VolumeSaveScreen from '../../../../../screens/volume-save/VolumeSaveScreen';

type Params = {
  mangaId: string;
  volumeId: string;
};

export default function MangaVolumeUpdatePage() {
  const params = useLocalSearchParams<Params>();

  return (
    <AuthGuard>
      <Head>
        <title>Modifier le tome | MangaJap</title>
      </Head>

      <VolumeSaveScreen mangaId={params.mangaId} volumeId={params.volumeId} />
    </AuthGuard>
  );
}

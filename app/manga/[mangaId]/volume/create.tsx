import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import AuthGuard from '../../../../guards/AuthGuard';
import VolumeSaveScreen from '../../../../screens/volume-save/VolumeSaveScreen';

type Params = {
  mangaId: string;
};

export default function MangaVolumeCreatePage() {
  const params = useLocalSearchParams<Params>();

  return (
    <AuthGuard>
      <Head>
        <title>Ajouter un tome | MangaJap</title>
      </Head>

      <VolumeSaveScreen mangaId={params.mangaId} />
    </AuthGuard>
  );
}

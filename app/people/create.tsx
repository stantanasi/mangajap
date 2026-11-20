import Head from 'expo-router/head';
import AuthGuard from '../../guards/AuthGuard';
import PeopleSaveScreen from '../../screens/people-save/PeopleSaveScreen';

export default function PeopleCreatePage() {
  return (
    <AuthGuard>
      <Head>
        <title>Ajouter une personnalité | MangaJap</title>
      </Head>

      <PeopleSaveScreen />
    </AuthGuard>
  );
}

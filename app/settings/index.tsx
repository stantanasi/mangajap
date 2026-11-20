import Head from 'expo-router/head';
import AuthGuard from '../../guards/AuthGuard';
import SettingsScreen from '../../screens/settings/SettingsScreen';

export default function SettingsPage() {
  return (
    <AuthGuard>
      <Head>
        <title>Paramètres | MangaJap</title>
      </Head>

      <SettingsScreen />
    </AuthGuard>
  );
}
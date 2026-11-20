import Head from 'expo-router/head';
import AuthGuard from '../../guards/AuthGuard';
import ProfileEditScreen from '../../screens/profile-edit/ProfileEditScreen';

export default function ProfileEditPage() {
  return (
    <AuthGuard>
      <Head>
        <title>Modifier le profil | MangaJap</title>
      </Head>

      <ProfileEditScreen />
    </AuthGuard>
  );
}
import Head from 'expo-router/head';
import ProfileScreen from '../../screens/profile/ProfileScreen';

export default function ProfilePage() {
  return (
    <>
      <Head>
        <title>Profil | MangaJap</title>
      </Head>

      <ProfileScreen />
    </>
  );
}

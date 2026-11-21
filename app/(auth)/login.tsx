import { Redirect } from 'expo-router';
import Head from 'expo-router/head';
import { useAuthContext } from '../../contexts/AuthContext';
import LoginScreen from '../../screens/login/LoginScreen';

export default function LoginPage() {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <>
      <Head>
        <title>Connexion | MangaJap</title>
      </Head>

      <LoginScreen />
    </>
  );
}
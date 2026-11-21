import { Redirect } from 'expo-router';
import Head from 'expo-router/head';
import { useAuthContext } from '../../contexts/AuthContext';
import RegisterScreen from '../../screens/register/RegisterScreen';

export default function RegisterPage() {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <>
      <Head>
        <title>Inscription | MangaJap</title>
      </Head>

      <RegisterScreen />
    </>
  );
}
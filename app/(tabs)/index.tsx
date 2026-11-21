import Head from 'expo-router/head';
import HomeScreen from '../../screens/home/HomeScreen';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>MangaJap</title>
      </Head>

      <HomeScreen />
    </>
  );
}
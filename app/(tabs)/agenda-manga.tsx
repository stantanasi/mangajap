import Head from 'expo-router/head';
import AgendaMangaScreen from '../../screens/agenda-manga/AgendaMangaScreen';

export default function AgendaMangaPage() {
  return (
    <>
      <Head>
        <title>Agenda des mangas | MangaJap</title>
      </Head>

      <AgendaMangaScreen />
    </>
  );
}

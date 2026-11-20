import Head from 'expo-router/head';
import AgendaAnimeScreen from '../../screens/agenda-anime/AgendaAnimeScreen';

export default function AgendaAnimePage() {
  return (
    <>
      <Head>
        <title>Agenda des animes | MangaJap</title>
      </Head>

      <AgendaAnimeScreen />
    </>
  );
}

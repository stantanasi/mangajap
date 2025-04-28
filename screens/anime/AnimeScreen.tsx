import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../contexts/AuthContext';
import { Anime } from '../../models';
import AddAnimeButton from './components/AddAnimeButton';
import Header from './components/Header';
import AboutTab from './tabs/AboutTab';
import EpisodesTab from './tabs/EpisodesTab';

type Props = StaticScreenProps<{
  id: string;
}>;

export default function AnimeScreen({ route }: Props) {
  const navigation = useNavigation();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [anime, setAnime] = useState<Anime>();
  const [selectedTab, setSelectedTab] = useState<'about' | 'episodes'>('about');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      const anime = await Anime.findById(route.params.id)
        .include({
          genres: true,
          themes: true,
          seasons: {
            episodes: {
              'episode-entry': isAuthenticated,
            },
          },
          staff: {
            people: true,
          },
          franchises: {
            destination: true,
          },
          'anime-entry': isAuthenticated,
        });

      anime.seasons = [
        ...anime.seasons!.filter((s) => s.number !== 0),
        ...anime.seasons!.filter((s) => s.number === 0),
      ];

      setAnime(anime);
    };

    const unsubscribe = navigation.addListener('focus', () => {
      prepare()
        .catch((err) => console.error(err));
    });

    return unsubscribe;
  }, [route.params]);

  if (!anime) {
    return (
      <SafeAreaView style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator
          animating
          color="#000"
          size="large"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        anime={anime}
        tabs={[
          { key: 'about', title: 'À propos' },
          { key: 'episodes', title: 'Épisodes' },
        ]}
        selectedTab={selectedTab}
        onTabSelect={(tab) => setSelectedTab(tab)}
      />

      <AboutTab
        anime={anime}
        style={{
          display: selectedTab === 'about' ? 'flex' : 'none',
          flex: 1,
        }}
      />

      <EpisodesTab
        anime={anime}
        onAnimeChange={(anime) => setAnime(anime)}
        style={{
          display: selectedTab === 'episodes' ? 'flex' : 'none',
          flex: 1,
        }}
      />

      {user && !anime['anime-entry']?.isAdd ? (
        <AddAnimeButton
          anime={anime}
          onAnimeChange={(anime) => setAnime(anime)}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
  },
});

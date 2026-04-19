import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RefreshControl from '../../components/atoms/RefreshControl';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import Tabs from '../../components/organisms/Tabs';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import AddAnimeButton from './components/AddAnimeButton';
import Header from './components/Header';
import { useAnime } from './hooks/useAnime';
import AboutTab from './tabs/AboutTab';
import EpisodesTab from './tabs/EpisodesTab';

type Props = StaticScreenProps<{
  id: string;
}>;

export default function AnimeScreen({ route }: Props) {
  const navigation = useNavigation();
  const { isOffline } = useApp();
  const { user } = useAuth();
  const { isLoading, anime } = useAnime(route.params);

  useEffect(() => {
    if (!anime) return;

    navigation.setOptions({
      title: `${anime.title} - Anime | MangaJap`,
    });
  }, [anime]);

  if (!anime) {
    return (
      <LoadingScreen style={styles.container} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Container
        header={() => (
          <Header
            isLoading={isLoading}
            anime={anime}
          />
        )}
      >
        <Tabs.Tab name="À propos">
          <AboutTab
            isLoading={isLoading}
            anime={anime}
          />
        </Tabs.Tab>

        <Tabs.Tab name="Épisodes">
          <EpisodesTab
            isLoading={isLoading}
            anime={anime}
          />
        </Tabs.Tab>
      </Tabs.Container>

      {!isOffline && !isLoading && user && !anime['anime-entry']?.isAdd ? (
        <AddAnimeButton
          anime={anime}
        />
      ) : null}

      <RefreshControl refreshing={isLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import { router } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '../../components/atoms/ProgressBar';
import RefreshControl from '../../components/atoms/RefreshControl';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import Tabs from '../../components/organisms/Tabs';
import { useAppContext } from '../../contexts/AppContext';
import { useAuthContext } from '../../contexts/AuthContext';
import AddAnimeButton from './components/AddAnimeButton';
import { useAnime } from './hooks/useAnime';
import AboutTab from './tabs/AboutTab';
import EpisodesTab from './tabs/EpisodesTab';

type Props = {
  animeId: string;
};

export default function AnimeScreen(props: Props) {
  const { isOffline } = useAppContext();
  const { user } = useAuthContext();
  const { isLoading, anime } = useAnime(props);

  if (!anime) {
    return (
      <LoadingScreen style={styles.container} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Container
        title={anime.title}
        menuItems={!isOffline && !isLoading && user ? [
          {
            icon: 'edit',
            onPress: () => router.navigate({
              pathname: '/anime/[animeId]/edit',
              params: { animeId: anime.id },
            }),
          },
        ] : []}
        TabBarComponent={(props) => (<>
          <ProgressBar progress={anime.progress} />
          <Tabs.Bar {...props} />
        </>)}
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

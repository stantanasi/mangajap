import { StaticScreenProps } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RefreshControl from '../../components/atoms/RefreshControl';
import { useApp } from '../../contexts/AppContext';
import { AuthContext } from '../../contexts/AuthContext';
import AddAnimeButton from './components/AddAnimeButton';
import Header from './components/Header';
import { useAnime } from './hooks/useAnime';
import AboutTab from './tabs/AboutTab';
import EpisodesTab from './tabs/EpisodesTab';

type Props = StaticScreenProps<{
  id: string;
}>;

export default function AnimeScreen({ route }: Props) {
  const { isOffline } = useApp();
  const { user } = useContext(AuthContext);
  const { isLoading, anime } = useAnime(route.params);
  const [selectedTab, setSelectedTab] = useState<'about' | 'episodes'>('about');

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
        isLoading={isLoading}
        anime={anime}
        tabs={[
          { key: 'about', title: 'À propos' },
          { key: 'episodes', title: 'Épisodes' },
        ]}
        selectedTab={selectedTab}
        onTabSelect={(tab) => setSelectedTab(tab)}
      />

      <AboutTab
        isLoading={isLoading}
        anime={anime}
        style={{
          display: selectedTab === 'about' ? 'flex' : 'none',
          flex: 1,
        }}
      />

      <EpisodesTab
        isLoading={isLoading}
        anime={anime}
        style={{
          display: selectedTab === 'episodes' ? 'flex' : 'none',
          flex: 1,
        }}
      />

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

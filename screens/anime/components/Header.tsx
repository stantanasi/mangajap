import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import ProgressBar from '../../../components/atoms/ProgressBar';
import TabBar from '../../../components/atoms/TabBar';
import BaseHeader from '../../../components/molecules/Header';
import { useApp } from '../../../contexts/AppContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Anime } from '../../../models';

type Props<T extends string> = {
  isLoading: boolean;
  anime: Anime;
  tabs: React.ComponentProps<typeof TabBar<T>>['tabs'];
  selectedTab: T;
  onTabSelect: (tab: T) => void;
};

export default function Header<T extends string>({
  isLoading,
  anime,
  tabs,
  selectedTab,
  onTabSelect,
}: Props<T>) {
  const navigation = useNavigation();
  const { isOffline } = useApp();
  const { user } = useAuth();

  const progress = anime['anime-entry']
    ? (anime['anime-entry'].episodesWatch / anime.episodeCount) * 100
    : 0;

  return (
    <BaseHeader
      title={anime.title}
      menuItems={!isOffline && !isLoading && user ? [
        {
          icon: 'edit',
          onPress: () => navigation.navigate('AnimeUpdate', { id: anime.id }),
        },
      ] : []}
      style={styles.container}
    >
      <ProgressBar
        progress={progress}
      />

      <TabBar
        selected={selectedTab}
        tabs={tabs}
        onTabChange={(key) => onTabSelect(key)}
      />
    </BaseHeader>
  );
}

const styles = StyleSheet.create({
  container: {},
});

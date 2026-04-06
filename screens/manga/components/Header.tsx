import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import ProgressBar from '../../../components/atoms/ProgressBar';
import TabBar from '../../../components/atoms/TabBar';
import BaseHeader from '../../../components/molecules/Header';
import { useApp } from '../../../contexts/AppContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Manga } from '../../../models';

type Props<T extends string> = {
  isLoading: boolean;
  manga: Manga;
  tabs: React.ComponentProps<typeof TabBar<T>>['tabs'];
  selectedTab: T;
  onTabSelect: (tab: T) => void;
};

export default function Header<T extends string>({
  isLoading,
  manga,
  tabs,
  selectedTab,
  onTabSelect,
}: Props<T>) {
  const navigation = useNavigation();
  const { isOffline } = useApp();
  const { user } = useAuth();

  return (
    <BaseHeader
      title={manga.title}
      menuItems={!isOffline && !isLoading && user ? [
        {
          icon: 'edit',
          onPress: () => navigation.navigate('MangaUpdate', { id: manga.id }),
        },
      ] : []}
      style={styles.container}
    >
      <ProgressBar
        progress={manga.progress}
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

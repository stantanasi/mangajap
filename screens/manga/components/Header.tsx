import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import ProgressBar from '../../../components/atoms/ProgressBar';
import BaseHeader from '../../../components/molecules/Header';
import Tabs from '../../../components/organisms/Tabs';
import { useApp } from '../../../contexts/AppContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Manga } from '../../../models';

type Props = {
  isLoading: boolean;
  manga: Manga;
};

export default function Header({
  isLoading,
  manga,
}: Props) {
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

      <Tabs.Bar />
    </BaseHeader>
  );
}

const styles = StyleSheet.create({
  container: {},
});

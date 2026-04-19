import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import ProgressBar from '../../../components/atoms/ProgressBar';
import BaseHeader from '../../../components/molecules/Header';
import Tabs from '../../../components/organisms/Tabs';
import { useApp } from '../../../contexts/AppContext';
import { useAuth } from '../../../contexts/AuthContext';
import { Anime } from '../../../models';

type Props = {
  isLoading: boolean;
  anime: Anime;
};

export default function Header({
  isLoading,
  anime,
}: Props) {
  const navigation = useNavigation();
  const { isOffline } = useApp();
  const { user } = useAuth();

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
        progress={anime.progress}
      />

      <Tabs.Bar />
    </BaseHeader>
  );
}

const styles = StyleSheet.create({
  container: {},
});

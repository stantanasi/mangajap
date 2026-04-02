import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RefreshControl from '../../components/atoms/RefreshControl';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import AddMangaButton from './components/AddMangaButton';
import Header from './components/Header';
import { useManga } from './hooks/useManga';
import AboutTab from './tabs/AboutTab';
import ChaptersTab from './tabs/ChaptersTab';

type Props = StaticScreenProps<{
  id: string;
}>;

export default function MangaScreen({ route }: Props) {
  const navigation = useNavigation();
  const { isOffline } = useApp();
  const { user } = useAuth();
  const { isLoading, manga } = useManga(route.params);
  const [selectedTab, setSelectedTab] = useState<'about' | 'chapters'>('about');

  useEffect(() => {
    if (!manga) return;

    navigation.setOptions({
      title: `${manga.title} - Manga | MangaJap`,
    });
  }, [manga]);

  if (!manga) {
    return (
      <LoadingScreen style={styles.container} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        isLoading={isLoading}
        manga={manga}
        tabs={[
          { key: 'about', title: 'À propos' },
          { key: 'chapters', title: 'Chapitres' },
        ]}
        selectedTab={selectedTab}
        onTabSelect={(tab) => setSelectedTab(tab)}
      />

      <AboutTab
        isLoading={isLoading}
        manga={manga}
        style={{
          display: selectedTab === 'about' ? 'flex' : 'none',
          flex: 1,
        }}
      />

      <ChaptersTab
        isLoading={isLoading}
        manga={manga}
        style={{
          display: selectedTab === 'chapters' ? 'flex' : 'none',
          flex: 1,
        }}
      />

      {!isOffline && !isLoading && user && !manga['manga-entry']?.isAdd ? (
        <AddMangaButton
          manga={manga}
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
  header: {
    backgroundColor: '#fff',
  },
});

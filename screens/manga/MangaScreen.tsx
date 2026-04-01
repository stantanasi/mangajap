import { StaticScreenProps } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RefreshControl from '../../components/atoms/RefreshControl';
import { useApp } from '../../contexts/AppContext';
import { AuthContext } from '../../contexts/AuthContext';
import AddMangaButton from './components/AddMangaButton';
import Header from './components/Header';
import { useManga } from './hooks/useManga';
import AboutTab from './tabs/AboutTab';
import ChaptersTab from './tabs/ChaptersTab';

type Props = StaticScreenProps<{
  id: string;
}>;

export default function MangaScreen({ route }: Props) {
  const { isOffline } = useApp();
  const { user } = useContext(AuthContext);
  const { isLoading, manga } = useManga(route.params);
  const [selectedTab, setSelectedTab] = useState<'about' | 'chapters'>('about');

  if (!manga) {
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

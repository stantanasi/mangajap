import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../contexts/AuthContext';
import { Manga } from '../../models';
import AddMangaButton from './components/AddMangaButton';
import Header from './components/Header';
import AboutTab from './tabs/AboutTab';
import VolumesTab from './tabs/VolumesTab';

type Props = StaticScreenProps<{
  id: string;
}>;

export default function MangaScreen({ route }: Props) {
  const navigation = useNavigation();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [manga, setManga] = useState<Manga>();
  const [selectedTab, setSelectedTab] = useState<'about' | 'volumes'>('about');

  useEffect(() => {
    const prepare = async () => {
      const manga = await Manga.findById(route.params.id)
        .include({
          genres: true,
          themes: true,
          volumes: {
            chapters: {
              'chapter-entry': isAuthenticated,
            },
            'volume-entry': isAuthenticated,
          },
          chapters: {
            'chapter-entry': isAuthenticated,
          },
          staff: {
            people: true,
          },
          franchises: {
            destination: true,
          },
          'manga-entry': isAuthenticated,
        });

      setManga(manga);
    };

    const unsubscribe = navigation.addListener('focus', () => {
      prepare()
        .catch((err) => console.error(err));
    });

    return unsubscribe;
  }, [route.params]);

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

  const progress = manga['manga-entry']
    ? manga.chapterCount > 0
      ? (manga['manga-entry'].chaptersRead / manga.chapterCount) * 100
      : (manga['manga-entry'].volumesRead / manga.volumeCount) * 100
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <Header
        manga={manga}
        tabs={[
          { key: 'about', title: 'À propos' },
          { key: 'volumes', title: 'Tomes' },
        ]}
        selectedTab={selectedTab}
        onTabSelect={(tab) => setSelectedTab(tab)}
      />

      <AboutTab
        manga={manga}
        style={{
          display: selectedTab === 'about' ? 'flex' : 'none',
          flex: 1,
        }}
      />

      <VolumesTab
        manga={manga}
        onMangaChange={(manga) => setManga(manga)}
        style={{
          display: selectedTab === 'volumes' ? 'flex' : 'none',
          flex: 1,
        }}
      />

      {user && !manga['manga-entry']?.isAdd ? (
        <AddMangaButton
          manga={manga}
          onMangaChange={(manga) => setManga(manga)}
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

import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RefreshControl from '../../components/atoms/RefreshControl';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import Tabs from '../../components/organisms/Tabs';
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
      <Tabs.Container
        header={() => (
          <Header
            isLoading={isLoading}
            manga={manga}
          />
        )}
      >
        <Tabs.Tab name="À propos">
          <AboutTab
            isLoading={isLoading}
            manga={manga}
          />
        </Tabs.Tab>

        <Tabs.Tab name="Chapitres">
          <ChaptersTab
            isLoading={isLoading}
            manga={manga}
          />
        </Tabs.Tab>
      </Tabs.Container>

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

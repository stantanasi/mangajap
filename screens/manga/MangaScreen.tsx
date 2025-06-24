import { StaticScreenProps } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../contexts/AuthContext';
import { Manga } from '../../models';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import AddMangaButton from './components/AddMangaButton';
import Header from './components/Header';
import AboutTab from './tabs/AboutTab';
import ChaptersTab from './tabs/ChaptersTab';

type Props = StaticScreenProps<{
  id: string;
}>;

export default function MangaScreen({ route }: Props) {
  const { user } = useContext(AuthContext);
  const { isLoading, manga } = useManga(route.params);
  const [selectedTab, setSelectedTab] = useState<'about' | 'chapters'>('about');

  if (isLoading || !manga) {
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
        manga={manga}
        tabs={[
          { key: 'about', title: 'À propos' },
          { key: 'chapters', title: 'Chapitres' },
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

      <ChaptersTab
        manga={manga}
        style={{
          display: selectedTab === 'chapters' ? 'flex' : 'none',
          flex: 1,
        }}
      />

      {user && !manga['manga-entry']?.isAdd ? (
        <AddMangaButton
          manga={manga}
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


const useManga = (params: Props['route']['params']) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  const manga = useAppSelector((state) => {
    return Manga.redux.selectors.selectById(state, params.id, {
      include: {
        genres: true,
        themes: true,
        volumes: {
          include: {
            chapters: {
              include: {
                'chapter-entry': isAuthenticated,
              },
            },
            'volume-entry': isAuthenticated,
          },
          sort: {
            number: 'asc',
          },
        },
        chapters: {
          include: {
            'chapter-entry': isAuthenticated,
          },
          sort: {
            number: 'asc',
          },
        },
        staff: {
          include: {
            people: true,
          },
        },
        franchises: {
          include: {
            destination: true,
          },
        },
        'manga-entry': isAuthenticated,
      },
    });
  });

  useEffect(() => {
    const prepare = async () => {
      const manga = await Manga.findById(params.id)
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

      dispatch(Manga.redux.actions.setOne(manga));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [params]);

  return { isLoading, manga };
};

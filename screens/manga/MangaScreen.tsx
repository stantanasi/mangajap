import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '../../components/atoms/ProgressBar';
import TabBar from '../../components/atoms/TabBar';
import { AuthContext } from '../../contexts/AuthContext';
import { Manga, MangaEntry, User } from '../../models';
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
  const [isUpdating, setIsUpdating] = useState(false);

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
      <View style={styles.header}>
        <View
          style={{
            alignItems: 'flex-start',
            flexDirection: 'row',
          }}
        >
          <MaterialIcons
            name="arrow-back"
            color="#000"
            size={24}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else if (typeof window !== 'undefined') {
                window.history.back();
              }
            }}
            style={{
              padding: 12,
            }}
          />

          <Text
            style={{
              flex: 1,
              fontSize: 18,
              fontWeight: 'bold',
              padding: 12,
            }}
          >
            {manga.title}
          </Text>

          {user && user.isAdmin ? (
            <MaterialIcons
              name="edit"
              color="#000"
              size={24}
              onPress={() => navigation.navigate('MangaUpdate', { id: manga.id })}
              style={{
                padding: 12,
              }}
            />
          ) : null}
        </View>

        <ProgressBar
          progress={progress}
        />

        <TabBar
          selected={selectedTab}
          tabs={[
            { key: 'about', title: 'À propos' },
            { key: 'volumes', title: 'Tomes' },
          ]}
          onTabChange={(key) => setSelectedTab(key)}
        />
      </View>

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
        <Pressable
          onPress={() => {
            setIsUpdating(true);

            const updateMangaEntry = async () => {
              if (manga['manga-entry']) {
                const mangaEntry = manga['manga-entry'].copy({
                  isAdd: true,
                });
                await mangaEntry.save();

                setManga((prev) => prev?.copy({
                  'manga-entry': mangaEntry,
                }));
              } else {
                const mangaEntry = new MangaEntry({
                  isAdd: true,

                  user: new User({ id: user.id }),
                  manga: manga,
                });
                await mangaEntry.save();

                setManga((prev) => prev?.copy({
                  'manga-entry': mangaEntry,
                }));
              }
            };

            updateMangaEntry()
              .catch((err) => console.error(err))
              .finally(() => setIsUpdating(false));
          }}
          style={{
            alignItems: 'center',
            backgroundColor: '#4281f5',
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'center',
            padding: 16,
          }}
        >
          {!isUpdating ? (
            <MaterialIcons
              name="add"
              color="#fff"
              size={24}
            />
          ) : (
            <ActivityIndicator
              animating
              color="#fff"
              size={24}
            />
          )}

          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            Ajouter le manga
          </Text>
        </Pressable>
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

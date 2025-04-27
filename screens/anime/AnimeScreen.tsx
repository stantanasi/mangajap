import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProgressBar from '../../components/atoms/ProgressBar';
import TabBar from '../../components/atoms/TabBar';
import { AuthContext } from '../../contexts/AuthContext';
import { Anime, AnimeEntry, User } from '../../models';
import AboutTab from './tabs/AboutTab';
import EpisodesTab from './tabs/EpisodesTab';

type Props = StaticScreenProps<{
  id: string;
}>;

export default function AnimeScreen({ route }: Props) {
  const navigation = useNavigation();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [anime, setAnime] = useState<Anime>();
  const [selectedTab, setSelectedTab] = useState<'about' | 'episodes'>('about');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      const anime = await Anime.findById(route.params.id)
        .include({
          genres: true,
          themes: true,
          seasons: {
            episodes: {
              'episode-entry': isAuthenticated,
            },
          },
          staff: {
            people: true,
          },
          franchises: {
            destination: true,
          },
          'anime-entry': isAuthenticated,
        });

      anime.seasons = [
        ...anime.seasons!.filter((s) => s.number !== 0),
        ...anime.seasons!.filter((s) => s.number === 0),
      ];

      setAnime(anime);
    };

    const unsubscribe = navigation.addListener('focus', () => {
      prepare()
        .catch((err) => console.error(err));
    });

    return unsubscribe;
  }, [route.params]);

  if (!anime) {
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

  const progress = anime['anime-entry']
    ? (anime['anime-entry'].episodesWatch / anime.episodeCount) * 100
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
            onPress={() => navigation.goBack()}
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
            {anime.title}
          </Text>

          {user && user.isAdmin ? (
            <MaterialIcons
              name="edit"
              color="#000"
              size={24}
              onPress={() => navigation.navigate('AnimeUpdate', { id: anime.id })}
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
            { key: 'episodes', title: 'Épisodes' },
          ]}
          onTabChange={(key) => setSelectedTab(key)}
        />
      </View>

      <AboutTab
        anime={anime}
        style={{
          display: selectedTab === 'about' ? 'flex' : 'none',
          flex: 1,
        }}
      />

      <EpisodesTab
        anime={anime}
        onAnimeChange={(anime) => setAnime(anime)}
        style={{
          display: selectedTab === 'episodes' ? 'flex' : 'none',
          flex: 1,
        }}
      />

      {user && !anime['anime-entry']?.isAdd ? (
        <Pressable
          onPress={() => {
            setIsUpdating(true);

            const updateAnimeEntry = async () => {
              if (anime['anime-entry']) {
                const animeEntry = anime['anime-entry'].copy({
                  isAdd: true,
                });
                await animeEntry.save();

                setAnime((prev) => prev?.copy({
                  'anime-entry': animeEntry,
                }));
              } else {
                const animeEntry = new AnimeEntry({
                  isAdd: true,

                  user: new User({ id: user.id }),
                  anime: anime,
                });
                await animeEntry.save();

                setAnime((prev) => prev?.copy({
                  'anime-entry': animeEntry,
                }));
              }
            };

            updateAnimeEntry()
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
            Ajouter l'animé
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

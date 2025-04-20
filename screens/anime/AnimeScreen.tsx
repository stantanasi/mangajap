import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
        .include([
          'genres',
          'themes',
          `seasons.episodes${isAuthenticated ? '.episode-entry' : ''}`,
          'franchises.destination',
          ...(isAuthenticated ? ['anime-entry'] : []),
        ]);

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

  return (
    <SafeAreaView style={styles.container}>
      <TabBar
        selected={selectedTab}
        tabs={[
          { key: 'about', title: 'À propos' },
          { key: 'episodes', title: 'Épisodes' },
        ]}
        onTabChange={(key) => setSelectedTab(key)}
      />

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
});

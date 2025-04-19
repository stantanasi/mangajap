import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, SectionList, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from '../../components/atoms/AutoHeightImage';
import TabBar from '../../components/atoms/TabBar';
import EpisodeCard from '../../components/molecules/EpisodeCard';
import SeasonCard from '../../components/molecules/SeasonCard';
import { AuthContext } from '../../contexts/AuthContext';
import { Anime, AnimeEntry, Episode, EpisodeEntry, Season, User } from '../../models';

const AboutTab = ({ anime, style }: {
  anime: Anime;
  style?: StyleProp<ViewStyle>;
}) => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingVertical: 16,
      }}
      style={style}
    >
      {user && user.isAdmin ? (
        <MaterialIcons
          name="edit"
          color="#000"
          size={24}
          onPress={() => navigation.navigate('AnimeUpdate', { id: anime.id })}
          style={{
            alignSelf: 'flex-end',
            marginRight: 16,
          }}
        />
      ) : null}

      <AutoHeightImage
        source={{ uri: anime.poster ?? undefined }}
        style={styles.poster}
      />

      <Text style={styles.title}>
        {anime.title}
      </Text>

      <View style={styles.genres}>
        {anime.genres?.map((genre) => (
          <Text
            key={genre.id}
            style={styles.genre}
          >
            {genre.name}
          </Text>
        ))}
      </View>

      <View style={styles.themes}>
        {anime.themes?.map((theme) => (
          <Text
            key={theme.id}
            style={styles.theme}
          >
            {theme.name}
          </Text>
        ))}
      </View>

      <Text style={styles.overview}>
        {anime.overview}
      </Text>
    </ScrollView>
  );
};

const EpisodesTab = ({ anime, onAnimeChange, style }: {
  anime: Anime;
  onAnimeChange: (anime: Anime) => void;
  style?: StyleProp<ViewStyle>;
}) => {
  const { user } = useContext(AuthContext);
  const [expandedSeasons, setExpandedSeasons] = useState<{ [seasonId: string]: boolean }>({});
  const [updating, setUpdating] = useState<{ [id: string]: boolean }>({});
  const [previousUnwatched, setPreviousUnwatched] = useState<(Season | Episode)[]>();

  const findPreviousSeasonsEpisodes = (item: Season | Episode) => {
    const sections = anime.seasons!.map((season) => ({
      season: season,
      data: season.episodes!,
    }));

    const previous: (Season | Episode)[] = [];

    for (const section of sections) {
      if (section.season.id === item.id) {
        return previous;
      }

      for (const episode of section.data) {
        if (episode.id === item.id) {
          return previous;
        }
        previous.push(episode);
      }

      previous.push(section.season);
    }

    return previous;
  };

  return (
    <View style={style}>
      <SectionList
        sections={anime.seasons!.map((season) => ({
          season: season,
          data: expandedSeasons[season.id] ? season.episodes! : [],
        }))}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { season } }) => (
          <SeasonCard
            season={season}
            onSeasonChange={(season) => {
              onAnimeChange(anime.copy({
                seasons: anime.seasons?.map((s) => s.id === season.id ? season : s),
              }));
            }}
            onWatchedChange={(value) => {
              if (!value) return

              const previousUnwatched = findPreviousSeasonsEpisodes(season)
                .filter((value) => value instanceof Season
                  ? value.episodes!.some((e) => !e['episode-entry'])
                  : !value['episode-entry']
                );

              if (previousUnwatched.length > 0) {
                setPreviousUnwatched(previousUnwatched);
              }
            }}
            updating={updating[season.id]}
            onUpdatingChange={(value) => setUpdating((prev) => ({
              ...prev,
              [season.id]: value,
              ...season.episodes?.reduce((acc, episode) => {
                acc[episode.id] = value;
                return acc;
              }, {} as typeof updating),
            }))}
            onEpisodeUpdatingChange={(id, value) => setUpdating((prev) => ({ ...prev, [id]: value }))}
            onPress={() => setExpandedSeasons((prev) => ({ ...prev, [season.id]: !prev[season.id] }))}
            expanded={expandedSeasons[season.id]}
            style={{
              marginTop: 5,
              marginHorizontal: 16,
            }}
          />
        )}
        renderSectionFooter={() => <View style={{ height: 5 }} />}
        renderItem={({ item, section: { season } }) => (
          <EpisodeCard
            episode={item}
            onEpisodeChange={(episode) => {
              onAnimeChange(anime.copy({
                seasons: anime.seasons?.map((s) => s.id === season.id
                  ? season.copy({
                    episodes: season.episodes?.map((e) => e.id === episode.id ? episode : e),
                  })
                  : s),
              }));
            }}
            onWatchedChange={(value) => {
              if (!value) return

              const previousUnwatched = findPreviousSeasonsEpisodes(item)
                .filter((value) => value instanceof Season
                  ? value.episodes!.some((e) => !e['episode-entry'])
                  : !value['episode-entry']
                );

              if (previousUnwatched.length > 0) {
                setPreviousUnwatched(previousUnwatched);
              }
            }}
            updating={updating[item.id]}
            onUpdatingChange={(value) => setUpdating((prev) => ({ ...prev, [item.id]: value }))}
            style={{
              marginHorizontal: 16,
            }}
          />
        )}
        SectionSeparatorComponent={() => <View style={{ height: 10 }} />}
        ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
        removeClippedSubviews
        contentContainerStyle={{
          paddingVertical: 11,
        }}
      />

      <Modal
        animationType="fade"
        onRequestClose={() => setPreviousUnwatched(undefined)}
        transparent
        visible={!!previousUnwatched}
      >
        <Pressable
          onPress={() => setPreviousUnwatched(undefined)}
          style={{
            alignItems: 'center',
            backgroundColor: '#00000052',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <Pressable
            style={{
              width: '90%',
              backgroundColor: '#fff',
              borderRadius: 4,
              padding: 16,
              gap: 12,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
              }}
            >
              Marquer les épisodes précédents ?
            </Text>

            <Text>
              Voulez-vous marquer les épisodes précédents comme vus ?
            </Text>

            <View style={{ alignSelf: 'flex-end', flexDirection: 'row', gap: 16 }}>
              <Text
                onPress={() => {
                  setUpdating((prev) => ({
                    ...prev,
                    ...Object.fromEntries(previousUnwatched!.map((value) => [value.id, true])),
                  }));

                  Promise.all(previousUnwatched!.map(async (value) => {
                    if (value instanceof Episode) {
                      let episode = value;

                      const episodeEntry = new EpisodeEntry({
                        user: new User({ id: user!.id }),
                        episode: episode,
                      });

                      episode = await episodeEntry.save()
                        .then((entry) => episode.copy({ 'episode-entry': entry }))
                        .catch((err) => {
                          console.error(err);
                          return episode;
                        });

                      const season = anime.seasons!.find((season) => season.episodes!.some((e) => e.id === episode.id))!;

                      onAnimeChange(anime.copy({
                        seasons: anime.seasons?.map((s) => s.id === season.id
                          ? s.copy({
                            episodes: s.episodes?.map((e) => e.id === episode.id ? episode : e),
                          })
                          : s),
                      }));
                      setUpdating((prev) => ({ ...prev, [episode.id]: false }));
                    }
                  }))
                    .catch((err) => console.error(err))
                    .finally(() => setUpdating((prev) => ({
                      ...prev,
                      ...Object.fromEntries(previousUnwatched!.map((value) => [value.id, false])),
                    })));

                  setPreviousUnwatched(undefined);
                }}
                style={{
                  fontWeight: 'bold',
                  padding: 10,
                }}
              >
                Oui
              </Text>

              <Text
                onPress={() => setPreviousUnwatched(undefined)}
                style={{
                  padding: 10,
                }}
              >
                Non
              </Text>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};


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
  poster: {
    width: '80%',
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  genre: {},
  themes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  theme: {},
  overview: {},
});

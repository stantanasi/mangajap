import { StaticScreenProps } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from '../../components/atoms/AutoHeightImage';
import EpisodeCard from '../../components/molecules/EpisodeCard';
import SeasonCard from '../../components/molecules/SeasonCard';
import { AuthContext } from '../../contexts/AuthContext';
import { Anime, Episode, EpisodeEntry, Season, User } from '../../models';

const Header = ({ anime }: { anime: Anime }) => {
  return (
    <View style={styles.header}>
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
    </View>
  );
};


type Props = StaticScreenProps<{
  id: string;
}>;

export default function AnimeScreen({ route }: Props) {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [anime, setAnime] = useState<Anime>();
  const [expandedSeasons, setExpandedSeasons] = useState<{ [seasonId: string]: boolean }>({});
  const [updating, setUpdating] = useState<{ [id: string]: boolean }>({});
  const [previousUnwatched, setPreviousUnwatched] = useState<(Season | Episode)[]>();

  useEffect(() => {
    const prepare = async () => {
      const anime = await Anime.findById(route.params.id)
        .include([
          'genres',
          'themes',
          `seasons.episodes${isAuthenticated ? '.episode-entry' : ''}`,
        ]);

      anime.seasons = [
        ...anime.seasons!.filter((s) => s.number !== 0),
        ...anime.seasons!.filter((s) => s.number === 0),
      ];

      setAnime(anime);
    };

    prepare()
      .catch((err) => console.error(err));
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
    <SafeAreaView style={styles.container}>
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
              setAnime((prev) => prev?.copy({
                seasons: prev.seasons?.map((s) => s.id === season.id ? season : s),
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
              marginHorizontal: 16,
            }}
          />
        )}
        renderSectionFooter={() => <View style={{ height: 10 }} />}
        renderItem={({ item, section: { season } }) => (
          <EpisodeCard
            episode={item}
            onEpisodeChange={(episode) => {
              setAnime((prev) => prev?.copy({
                seasons: prev.seasons?.map((s) => s.id === season.id
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
        ListHeaderComponent={Header({
          anime: anime,
        })}
        SectionSeparatorComponent={() => <View style={{ height: 10 }} />}
        ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
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
          <View
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

                      setAnime((prev) => prev?.copy({
                        seasons: prev.seasons?.map((s) => s.id === season.id
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
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
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

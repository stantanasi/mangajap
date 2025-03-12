import { StaticScreenProps } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from '../../components/atoms/AutoHeightImage';
import EpisodeCard from '../../components/molecules/EpisodeCard';
import SeasonCard from '../../components/molecules/SeasonCard';
import { Anime, Episode, Season } from '../../models';

type Props = StaticScreenProps<{
  id: string;
}>;

export default function AnimeScreen({ route }: Props) {
  const [anime, setAnime] = useState<Anime>();

  useEffect(() => {
    Anime.findById(route.params.id)
      .include([
        'genres',
        'themes',
        'seasons.episodes',
      ])
      .then((anime) => setAnime(anime));
  }, []);

  if (!anime) {
    return (
      <SafeAreaView
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
        }}
      >
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
      <FlatList
        data={anime.seasons?.flatMap((season) => [season, ...(season.episodes ?? [])])}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          item.type === Season.type ? (
            <SeasonCard
              season={item as Season}
            />
          ) : (
            <EpisodeCard
              episode={item as Episode}
            />
          )
        )}
        ListHeaderComponent={() => (
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
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {},
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

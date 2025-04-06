import { StaticScreenProps } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from '../../components/atoms/AutoHeightImage';
import SeasonCard from '../../components/molecules/SeasonCard';
import { AuthContext } from '../../contexts/AuthContext';
import { Anime } from '../../models';

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
  const { isAuthenticated } = useContext(AuthContext);
  const [anime, setAnime] = useState<Anime>();

  useEffect(() => {
    Anime.findById(route.params.id)
      .include([
        'genres',
        'themes',
        `seasons.episodes${isAuthenticated ? '.episode-entry' : ''}`,
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
        data={anime.seasons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SeasonCard
            season={item}
            onSeasonChange={(season) => {
              setAnime((prev) => prev?.copy({
                seasons: prev.seasons?.map((s) => s.id === season.id ? season : s),
              }));
            }}
            style={{
              marginHorizontal: 10,
            }}
          />
        )}
        ListHeaderComponent={Header({
          anime: anime,
        })}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
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

import { StaticScreenProps } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      .include(['seasons.episodes'])
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
      <Text>{anime.title}</Text>

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
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
});

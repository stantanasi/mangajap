import React from 'react';
import { Image, Pressable, PressableProps, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Anime } from '../../models';
import ProgressBar from '../atoms/ProgressBar';

type Props = PressableProps & {
  anime: Anime;
  style?: ViewStyle;
}

export default function AnimeAgendaCard({ anime, style, ...props }: Props) {
  const episodeWatchedCount = anime['anime-entry']?.episodesWatch ?? 0;

  const progress = (episodeWatchedCount / anime.episodeCount) * 100;

  return (
    <Pressable
      {...props}
      style={[styles.container, style]}
    >
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={{ uri: anime.poster ?? undefined }}
          resizeMode="cover"
          style={styles.image}
        />

        <View
          style={{
            alignItems: 'center',
            flex: 1,
            flexDirection: 'row',
            padding: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              {anime.title}
            </Text>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: '#666', fontSize: 11 }}>
              Épisodes
            </Text>
            <Text>
              {episodeWatchedCount} / {anime.episodeCount}
            </Text>
          </View>
        </View>
      </View>

      <ProgressBar
        progress={progress}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: 80,
    aspectRatio: 2 / 3,
    backgroundColor: '#ccc',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

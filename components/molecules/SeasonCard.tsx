import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Season } from '../../models';
import EpisodeCard from './EpisodeCard';

type Props = {
  season: Season;
  style?: ViewStyle;
}

export default function SeasonCard({ season, style }: Props) {
  const [showEpisodes, setShowEpisodes] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <Pressable
        onPress={() => setShowEpisodes((prev) => !prev)}
        style={{
          backgroundColor: '#fff',
          borderRadius: 4,
          overflow: 'hidden',
          marginBottom: 6,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Image
            source={{ uri: season.poster ?? undefined }}
            resizeMode="cover"
            style={styles.poster}
          />

          <View style={{ flex: 1, padding: 10 }}>
            <Text style={styles.number}>
              Saison {season.number}
            </Text>
          </View>

          <MaterialIcons
            name={showEpisodes ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={24}
            color="black"
            style={{
              marginRight: 14,
            }}
          />
        </View>
      </Pressable>

      <View style={{ gap: 6 }}>
        {showEpisodes && season.episodes?.map((episode) => (
          <EpisodeCard
            key={episode.id}
            episode={episode}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  poster: {
    width: 90,
    aspectRatio: 2 / 3,
    backgroundColor: '#ccc',
  },
  number: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

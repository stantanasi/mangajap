import Checkbox from 'expo-checkbox';
import React, { useContext } from 'react';
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Episode, EpisodeEntry, User } from '../../models';

type Props = {
  episode: Episode;
  onEpisodeChange: (episode: Episode) => void;
  style?: ViewStyle;
}

export default function EpisodeCard({ episode, onEpisodeChange, style }: Props) {
  const { user } = useContext(AuthContext);

  const isWatched = !!episode['episode-entry'];

  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri: episode.poster ?? undefined }}
        style={styles.poster}
      />

      <View style={{ flex: 1, padding: 10 }}>
        <Text style={styles.number}>
          Episode {episode.number}
        </Text>

        <Text style={styles.title}>
          {episode.title}
        </Text>
      </View>

      {user ? (
        <Checkbox
          value={isWatched}
          onValueChange={async (value) => {
            if (value && !episode['episode-entry']) {
              const episodeEntry = new EpisodeEntry({
                user: new User({ id: user.id }),
                episode: episode,
              });
              await episodeEntry.save();

              onEpisodeChange(episode.copy({
                'episode-entry': episodeEntry,
              }));
            } else if (!value && episode['episode-entry']) {
              await episode['episode-entry'].delete();

              onEpisodeChange(episode.copy({
                'episode-entry': null,
              }));
            }
          }}
          style={{
            marginRight: 10,
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  poster: {
    width: 120,
    height: '100%',
    minHeight: 80,
    backgroundColor: '#ccc',
  },
  number: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {},
});

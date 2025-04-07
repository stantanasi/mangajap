import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Episode, EpisodeEntry, User } from '../../models';

type Props = {
  episode: Episode;
  onEpisodeChange: (episode: Episode) => void;
  updating?: boolean;
  style?: ViewStyle;
}

export default function EpisodeCard({ episode, onEpisodeChange, updating = false, style }: Props) {
  const { user } = useContext(AuthContext);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsUpdating(updating);
  }, [updating]);

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
        <View
          style={{
            backgroundColor: !isWatched ? '#e5e5e5' : '#4281f5',
            borderRadius: 360,
            padding: 8,
            marginRight: 10,
          }}
        >
          {!isUpdating ? (
            <MaterialIcons
              name="check"
              size={20}
              color={!isWatched ? '#7e7e7e' : '#fff'}
              onPress={async () => {
                setIsUpdating(true);

                if (!isWatched && !episode['episode-entry']) {
                  const episodeEntry = new EpisodeEntry({
                    user: new User({ id: user.id }),
                    episode: episode,
                  });
                  await episodeEntry.save();

                  onEpisodeChange(episode.copy({
                    'episode-entry': episodeEntry,
                  }));
                } else if (isWatched && episode['episode-entry']) {
                  await episode['episode-entry'].delete();

                  onEpisodeChange(episode.copy({
                    'episode-entry': null,
                  }));
                }

                setIsUpdating(false);
              }}
            />
          ) : (
            <ActivityIndicator
              animating
              color="#fff"
              size={20}
            />
          )}
        </View>
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

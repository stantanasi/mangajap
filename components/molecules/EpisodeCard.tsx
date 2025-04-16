import React, { useContext } from 'react';
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Episode, EpisodeEntry, User } from '../../models';
import Checkbox from '../atoms/Checkbox';

type Props = {
  episode: Episode;
  onEpisodeChange?: (episode: Episode) => void;
  onWatchedChange?: (value: boolean) => void;
  updating?: boolean;
  onUpdatingChange?: (value: boolean) => void;
  style?: ViewStyle;
}

export default function EpisodeCard({
  episode,
  onEpisodeChange = () => { },
  onWatchedChange = () => { },
  updating = false,
  onUpdatingChange = () => { },
  style,
}: Props) {
  const { user } = useContext(AuthContext);

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
          value={!!episode['episode-entry']}
          onValueChange={(value) => {
            onWatchedChange(value);
            onUpdatingChange(true);

            const updateEpisodeEntry = async () => {
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
            };

            updateEpisodeEntry()
              .catch((err) => console.error(err))
              .finally(() => onUpdatingChange(false));
          }}
          loading={updating}
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

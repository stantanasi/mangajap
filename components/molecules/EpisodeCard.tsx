import React, { useContext } from 'react';
import { Image, Pressable, PressableProps, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Episode, EpisodeEntry, User } from '../../models';
import { useAppDispatch } from '../../redux/store';
import Checkbox from '../atoms/Checkbox';

type Props = PressableProps & {
  episode: Episode;
  onWatchedChange?: (value: boolean) => void;
  updating?: boolean;
  onUpdatingChange?: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

export default function EpisodeCard({
  episode,
  onWatchedChange = () => { },
  updating = false,
  onUpdatingChange = () => { },
  style,
  ...props
}: Props) {
  const dispatch = useAppDispatch();
  const { user } = useContext(AuthContext);

  const updateEpisodeEntry = async (add: boolean) => {
    if (!user) return

    if (add && !episode['episode-entry']) {
      const episodeEntry = new EpisodeEntry({
        user: new User({ id: user.id }),
        episode: episode,
      });
      await episodeEntry.save();

      EpisodeEntry.redux.sync(dispatch, episodeEntry, {
        episode: episode,
      });
    } else if (!add && episode['episode-entry']) {
      await episode['episode-entry'].delete();

      EpisodeEntry.redux.sync(dispatch, episode['episode-entry'], {
        episode: episode,
      });
    }
  };

  return (
    <Pressable
      {...props}
      style={[styles.container, style]}
    >
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

            updateEpisodeEntry(value)
              .catch((err) => console.error(err))
              .finally(() => onUpdatingChange(false));
          }}
          loading={updating}
          style={{
            marginRight: 10,
          }}
        />
      ) : null}
    </Pressable>
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

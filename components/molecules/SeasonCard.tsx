import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useContext } from 'react';
import { Image, Pressable, PressableProps, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Episode, EpisodeEntry, Season, User } from '../../models';
import { useAppDispatch } from '../../redux/store';
import Checkbox from '../atoms/Checkbox';
import ProgressBar from '../atoms/ProgressBar';

type Props = PressableProps & {
  season: Season;
  onWatchedChange?: (value: boolean) => void;
  updating?: boolean;
  onUpdatingChange?: (value: boolean) => void;
  onEpisodeUpdatingChange?: (id: string, value: boolean) => void;
  expanded?: boolean;
  onExpandedChange?: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

export default function SeasonCard({
  season,
  onWatchedChange = () => { },
  updating = false,
  onUpdatingChange = () => { },
  onEpisodeUpdatingChange = () => { },
  expanded = false,
  onExpandedChange = () => { },
  style,
  ...props
}: Props) {
  const dispatch = useAppDispatch();
  const { user } = useContext(AuthContext);

  const episodesWatchedCount = season.episodes?.filter((episode) => !!episode['episode-entry']).length ?? 0;
  const episodesCount = season.episodes?.length ?? 0;

  const progress = episodesCount > 0
    ? (episodesWatchedCount / episodesCount) * 100
    : 0;

  const updateSeasonEpisodesEntries = async (add: boolean) => {
    if (!user) return

    const updateEpisodeEntry = async (episode: Episode) => {
      if (add && !episode['episode-entry']) {
        const episodeEntry = new EpisodeEntry({
          user: new User({ id: user.id }),
          episode: episode,
        });
        await episodeEntry.save();

        dispatch(EpisodeEntry.redux.actions.saveOne(episodeEntry));
        dispatch(Episode.redux.actions.relations['episode-entry'].set(episode.id, episodeEntry));
      } else if (!add && episode['episode-entry']) {
        await episode['episode-entry'].delete();

        dispatch(EpisodeEntry.redux.actions.removeOne(episode['episode-entry']));
        dispatch(Episode.redux.actions.relations['episode-entry'].remove(episode.id, episode['episode-entry']));
      }
    };

    await Promise.all(season.episodes?.map(async (episode) => {
      onEpisodeUpdatingChange(episode.id, true);

      await updateEpisodeEntry(episode)
        .catch((err) => console.error(err))
        .finally(() => onEpisodeUpdatingChange(episode.id, false));
    }) ?? []);
  };

  return (
    <Pressable
      {...props}
      style={[styles.container, style]}
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
            {season.number !== 0
              ? `Saison ${season.number}`
              : 'Épisodes spéciaux'}
          </Text>
        </View>

        <MaterialIcons
          name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color="black"
          onPress={() => onExpandedChange(!expanded)}
          style={{
            marginRight: 14,
          }}
        />

        <Text
          style={{
            marginRight: 12,
          }}
        >
          {episodesWatchedCount} / {episodesCount}
        </Text>

        {user ? (
          <Checkbox
            value={episodesCount > 0 && episodesWatchedCount >= episodesCount}
            onValueChange={(value) => {
              onWatchedChange(value);
              onUpdatingChange(true);

              updateSeasonEpisodesEntries(value)
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

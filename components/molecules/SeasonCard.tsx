import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useContext } from 'react';
import { ActivityIndicator, Image, Pressable, PressableProps, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { EpisodeEntry, Season, User } from '../../models';
import ProgressBar from '../atoms/ProgressBar';

type Props = PressableProps & {
  season: Season;
  onSeasonChange?: (season: Season) => void;
  onWatchedChange?: (value: boolean) => void;
  updating?: boolean;
  onUpdatingChange?: (value: boolean) => void;
  expanded?: boolean;
  style?: ViewStyle;
}

export default function SeasonCard({
  season,
  onSeasonChange = () => { },
  onWatchedChange = () => { },
  updating = false,
  onUpdatingChange = () => { },
  expanded = false,
  style,
  ...props
}: Props) {
  const { user } = useContext(AuthContext);

  const episodesWatchedCount = season.episodes?.filter((episode) => !!episode['episode-entry']).length ?? 0;
  const episodesCount = season.episodes?.length ?? 0;

  const isWatched = episodesCount > 0 && episodesWatchedCount == episodesCount;
  const progress = episodesCount > 0
    ? (episodesWatchedCount / episodesCount) * 100
    : isWatched ? 100 : 0;

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
          <View
            style={{
              backgroundColor: !isWatched ? '#e5e5e5' : '#4281f5',
              borderRadius: 360,
              padding: 8,
              marginRight: 10,
            }}
          >
            {!updating ? (
              <MaterialIcons
                name="check"
                size={20}
                color={!isWatched ? '#7e7e7e' : '#fff'}
                onPress={() => {
                  onWatchedChange(!isWatched);
                  onUpdatingChange(true);

                  const updateSeasonEpisodesEntries = async () => {
                    const episodes = await Promise.all(season.episodes?.map(async (episode) => {
                      if (!isWatched && !episode['episode-entry']) {
                        const episodeEntry = new EpisodeEntry({
                          user: new User({ id: user.id }),
                          episode: episode,
                        });

                        return episodeEntry.save()
                          .then((entry) => episode.copy({ 'episode-entry': entry }))
                          .catch((err) => {
                            console.error(err);
                            return episode;
                          });
                      } else if (isWatched && episode['episode-entry']) {
                        return episode['episode-entry'].delete()
                          .then(() => episode.copy({ 'episode-entry': null }))
                          .catch((err) => {
                            console.error(err);
                            return episode;
                          });
                      }

                      return episode;
                    }) ?? []);

                    onSeasonChange(season.copy({
                      episodes: episodes,
                    }));
                  };

                  updateSeasonEpisodesEntries()
                    .catch((err) => console.error(err))
                    .finally(() => onUpdatingChange(false));
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

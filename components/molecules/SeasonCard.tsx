import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { EpisodeEntry, Season, User } from '../../models';
import ProgressBar from '../atoms/ProgressBar';
import EpisodeCard from './EpisodeCard';

type Props = {
  season: Season;
  onSeasonChange: (season: Season) => void;
  style?: ViewStyle;
}

export default function SeasonCard({ season, onSeasonChange, style }: Props) {
  const { user } = useContext(AuthContext);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEpisodes, setShowEpisodes] = useState(false);

  const episodesReadCount = season.episodes?.filter((episode) => !!episode['episode-entry']).length ?? 0;
  const episodesCount = season.episodes?.length ?? 0;

  const isWatched = episodesCount > 0 && episodesReadCount == episodesCount;
  const progress = episodesCount > 0
    ? (episodesReadCount / episodesCount) * 100
    : isWatched ? 100 : 0;

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

          <Text
            style={{
              marginRight: 12,
            }}
          >
            {episodesReadCount} / {episodesCount}
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
              {!isUpdating ? (
                <MaterialIcons
                  name="check"
                  size={20}
                  color={!isWatched ? '#7e7e7e' : '#fff'}
                  onPress={() => {
                    setIsUpdating(true);

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
                      .finally(() => setIsUpdating(false));
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

      <View style={{ gap: 6 }}>
        {showEpisodes && season.episodes?.map((episode) => (
          <EpisodeCard
            key={episode.id}
            episode={episode}
            onEpisodeChange={(episode) => {
              onSeasonChange(season.copy({
                episodes: season.episodes?.map((e) => e.id === episode.id ? episode : e),
              }));
            }}
            updating={isUpdating}
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

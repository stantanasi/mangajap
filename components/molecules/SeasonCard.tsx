import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Image, Pressable, PressableProps, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { toast } from 'sonner';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Episode, EpisodeEntry, Season, User } from '../../models';
import { useAppDispatch } from '../../redux/store';
import Checkbox from '../atoms/Checkbox';
import ProgressBar from '../atoms/ProgressBar';

type Props = PressableProps & {
  isLoading: boolean;
  season: Season;
  onWatchedChange?: (value: boolean) => void;
  updating?: boolean;
  onUpdatingChange?: (value: boolean) => void;
  onEpisodeUpdatingChange?: (id: string, value: boolean) => void;
  expanded?: boolean;
  onExpandedChange?: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

export default function SeasonCard({
  isLoading,
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
  const { isOffline } = useApp();
  const { user } = useAuth();

  const updateSeasonEpisodesEntries = async (add: boolean) => {
    if (!user) return;

    const updateEpisodeEntry = async (episode: Episode) => {
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

    await Promise.all(season.episodes?.map(async (episode) => {
      onEpisodeUpdatingChange(episode.id, true);

      await updateEpisodeEntry(episode)
        .catch((err) => {
          console.error(err);
          toast.error("Échec de la modification de votre suivi d'épisode", {
            description: err.message || "Une erreur inattendue s'est produite",
          });
        })
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
          {season.episodeWatchedCount} / {season.episodeCount}
        </Text>

        {!isOffline && !isLoading && user ? (
          <Checkbox
            value={season.episodeCount > 0 && season.episodeWatchedCount >= season.episodeCount}
            onValueChange={(value) => {
              onWatchedChange(value);
              onUpdatingChange(true);

              updateSeasonEpisodesEntries(value)
                .catch((err) => {
                  console.error(err);
                  toast.error("Échec de la modification de votre suivi d'épisodes", {
                    description: err.message || "Une erreur inattendue s'est produite",
                  });
                })
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
        progress={season.progress}
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

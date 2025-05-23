import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import AutoHeightImage from '../../../components/atoms/AutoHeightImage';
import Checkbox from '../../../components/atoms/Checkbox';
import Modal from '../../../components/atoms/Modal';
import { AuthContext } from '../../../contexts/AuthContext';
import { Episode, EpisodeEntry, Season, User } from '../../../models';
import { useAppDispatch } from '../../../redux/store';

type Props = {
  season: Season | undefined;
  onWatchedChange?: (value: boolean) => void;
  updating?: boolean;
  onUpdatingChange?: (value: boolean) => void;
  onEpisodeUpdatingChange?: (id: string, value: boolean) => void;
  onRequestClose: () => void;
  visible: boolean;
}

export default function SeasonModal({
  season,
  onWatchedChange = () => { },
  updating = false,
  onUpdatingChange = () => { },
  onEpisodeUpdatingChange = () => { },
  onRequestClose,
  visible,
}: Props) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  if (!season) {
    return (
      <Modal
        onRequestClose={onRequestClose}
        visible={visible}
        position="flex-start"
        style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}
      >
        <ActivityIndicator
          animating
          color="#000"
          size="small"
        />
      </Modal>
    );
  }

  const episodesWatchedCount = season.episodes?.filter((episode) => !!episode['episode-entry']).length ?? 0;
  const episodesCount = season.episodes?.length ?? 0;

  const updateSeasonEpisodesEntries = async (add: boolean) => {
    if (!user) return

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
        .catch((err) => console.error(err))
        .finally(() => onEpisodeUpdatingChange(episode.id, false));
    }) ?? []);
  };

  return (
    <Modal
      onRequestClose={onRequestClose}
      visible={visible}
      position="flex-start"
      style={styles.container}
    >
      <View
        style={{
          alignItems: 'flex-start',
          flexDirection: 'row',
        }}
      >
        <MaterialIcons
          name="close"
          color="#000"
          size={24}
          onPress={onRequestClose}
          style={{
            padding: 12,
          }}
        />

        <View style={{ flex: 1 }} />

        {user && user.isAdmin ? (
          <MaterialIcons
            name="edit"
            color="#000"
            size={24}
            onPress={() => {
              navigation.navigate('SeasonUpdate', { seasonId: season.id });
              onRequestClose();
            }}
            style={{
              padding: 12,
            }}
          />
        ) : null}
      </View>

      <AutoHeightImage
        source={{ uri: season.poster ?? undefined }}
        style={styles.poster}
      />

      <Text style={styles.number}>
        {season.number !== 0
          ? `Saison ${season.number}`
          : 'Épisodes spéciaux'}
      </Text>

      <Text style={styles.title}>
        {season.title}
      </Text>

      <View
        style={{
          alignItems: 'center',
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
          borderTopColor: '#ccc',
          borderTopWidth: 1,
          flexDirection: 'row',
          gap: 16,
          padding: 12,
        }}
      >
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: 4 }}>
          <MaterialIcons
            name="calendar-month"
            color={styles.airDate.color}
            size={20}
          />
          <Text style={styles.airDate}>
            {season.startDate?.toLocaleDateString() ?? 'Indisponible'}
          </Text>
        </View>

        {user ? (
          <>
            <View style={{ flex: 1 }} />

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
            />
          </>
        ) : null}
      </View>

      <Text style={styles.overview}>
        {season.overview || 'Synopsis non disponible'}
      </Text>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: '5%',
    minHeight: 100,
  },
  poster: {
    width: 150,
    alignSelf: 'center',
    marginHorizontal: 12,
  },
  number: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 12,
    marginTop: 20,
    textAlign: 'center',
  },
  title: {
    color: '#888',
    fontSize: 16,
    marginBottom: 12,
    marginHorizontal: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  airDate: {
    color: '#666',
  },
  overview: {
    margin: 12,
  },
});

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import AutoHeightImage from '../../../components/atoms/AutoHeightImage';
import Checkbox from '../../../components/atoms/Checkbox';
import DateTimePicker from '../../../components/atoms/DateTimePicker';
import Modal from '../../../components/atoms/Modal';
import { AuthContext } from '../../../contexts/AuthContext';
import { Episode, EpisodeEntry, User } from '../../../models';
import { useAppDispatch } from '../../../redux/store';

type Props = {
  episode: Episode | undefined;
  onEpisodeChange?: (episode: Episode) => void;
  onWatchedChange?: (value: boolean) => void;
  updating?: boolean;
  onUpdatingChange?: (value: boolean) => void;
  onRequestClose: () => void;
  visible: boolean;
}

export default function EpisodeModal({
  episode,
  onEpisodeChange = () => { },
  onWatchedChange = () => { },
  updating = false,
  onUpdatingChange = () => { },
  onRequestClose,
  visible,
}: Props) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [watchedDatePickerVisible, setWatchedDatePickerVisible] = useState(false);
  const [isSavingWatchedDate, setIsSavingWatchedDate] = useState(false);

  if (!episode) {
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

  const updateEpisodeEntry = async (add: boolean) => {
    if (!user) return

    const episodeEntry = await (async () => {
      if (add && !episode['episode-entry']) {
        const episodeEntry = new EpisodeEntry({
          user: new User({ id: user.id }),
          episode: episode,
        });
        await episodeEntry.save();

        dispatch(EpisodeEntry.redux.actions.setOne(episodeEntry));
        dispatch(Episode.redux.actions.relations['episode-entry'].set(episode.id, episodeEntry));

        return episodeEntry;
      } else if (!add && episode['episode-entry']) {
        await episode['episode-entry'].delete();

        dispatch(EpisodeEntry.redux.actions.removeOne(episode['episode-entry']));
        dispatch(Episode.redux.actions.relations['episode-entry'].remove(episode.id, episode['episode-entry']));

        return null;
      }

      return episode['episode-entry'];
    })()
      .catch((err) => {
        console.error(err);
        return episode['episode-entry'];
      });

    onEpisodeChange(episode.copy({
      'episode-entry': episodeEntry,
    }));
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
              navigation.navigate('EpisodeUpdate', { episodeId: episode.id });
              onRequestClose();
            }}
            style={{
              padding: 12,
            }}
          />
        ) : null}
      </View>

      <AutoHeightImage
        source={{ uri: episode.poster ?? undefined }}
        style={styles.poster}
      />

      <Text style={styles.number}>
        {`${episode.season ? `S${episode.season.number} | ` : ''}E${episode.number}`}
      </Text>

      <Text style={styles.title}>
        {episode.title}
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
            color={styles.date.color}
            size={20}
          />
          <Text style={styles.date}>
            {episode.airDate?.toLocaleDateString() ?? 'Indisponible'}
          </Text>
        </View>

        {user ? (
          <>
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: 4 }}>
              {!isSavingWatchedDate ? (
                <MaterialIcons
                  name="visibility"
                  color={styles.date.color}
                  size={20}
                />
              ) : (
                <ActivityIndicator
                  animating
                  color={styles.date.color}
                  size={20}
                />
              )}
              <Text
                onPress={() => {
                  if (!episode['episode-entry']) return
                  setWatchedDatePickerVisible(true);
                }}
                style={styles.date}
              >
                {episode['episode-entry']?.watchedDate.toLocaleDateString() ?? 'Pas vu'}
              </Text>

              {episode['episode-entry'] ? (
                <DateTimePicker
                  value={episode['episode-entry'].watchedDate}
                  onValueChange={(value) => {
                    setIsSavingWatchedDate(true);

                    const updateWatchedDate = async () => {
                      const episodeEntry = episode['episode-entry']!.copy({
                        watchedDate: value,
                      });
                      await episodeEntry.save();

                      dispatch(EpisodeEntry.redux.actions.setOne(episodeEntry));

                      onEpisodeChange(episode.copy({
                        'episode-entry': episodeEntry,
                      }));
                    };

                    updateWatchedDate()
                      .catch((err) => console.error(err))
                      .finally(() => setIsSavingWatchedDate(false))
                  }}
                  onRequestClose={() => setWatchedDatePickerVisible(false)}
                  visible={watchedDatePickerVisible}
                />
              ) : null}
            </View>

            <View style={{ flex: 1 }} />

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
            />
          </>
        ) : null}
      </View>

      <Text style={styles.overview}>
        {episode.overview || 'Synopsis non disponible'}
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
  date: {
    color: '#666',
  },
  overview: {
    margin: 12,
  },
});

import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from '../../../components/atoms/Modal';
import { AuthContext } from '../../../contexts/AuthContext';
import { Episode, EpisodeEntry, Season, User } from '../../../models';
import { useAppDispatch } from '../../../redux/store';

type Props = {
  previousUnwatched: (Season | Episode)[];
  onUpdatingChange: (updating: { [id: string]: boolean }) => void;
  onRequestClose: () => void;
  visible: boolean;
}

export default function MarkPreviousAsWatchedModal({
  previousUnwatched,
  onUpdatingChange,
  onRequestClose,
  visible
}: Props) {
  const dispatch = useAppDispatch();
  const { user } = useContext(AuthContext);

  const markPreviousAsWatched = async () => {
    if (!user) return

    onUpdatingChange(Object.fromEntries(previousUnwatched.map((value) => [value.id, true])));

    const updateEpisodeEntry = async (episode: Episode) => {
      const episodeEntry = new EpisodeEntry({
        user: new User({ id: user.id }),
        episode: episode,
      });

      await episodeEntry.save();

      dispatch(EpisodeEntry.redux.actions.saveOne(episodeEntry));
      dispatch(Episode.redux.actions.relations['episode-entry'].set(episode.id, episodeEntry));
    };

    await Promise.all(previousUnwatched.map(async (value) => {
      if (value instanceof Episode) {
        const episode = value;

        updateEpisodeEntry(episode)
          .catch((err) => console.error(err));
      }

      onUpdatingChange({ [value.id]: false });
    }));
  }

  return (
    <Modal
      onRequestClose={onRequestClose}
      visible={visible}
      style={styles.container}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
        }}
      >
        Marquer les épisodes précédents ?
      </Text>

      <Text>
        Voulez-vous marquer les épisodes précédents comme vus ?
      </Text>

      <View style={{ alignSelf: 'flex-end', flexDirection: 'row', gap: 16 }}>
        <Text
          onPress={() => {
            onRequestClose();
            markPreviousAsWatched();
          }}
          style={{
            fontWeight: 'bold',
            padding: 10,
          }}
        >
          Oui
        </Text>

        <Text
          onPress={() => onRequestClose()}
          style={{
            padding: 10,
          }}
        >
          Non
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
});

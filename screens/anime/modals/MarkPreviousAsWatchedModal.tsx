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

    const updateEpisodeEntry = async (episode: Episode) => {
      const episodeEntry = new EpisodeEntry({
        user: new User({ id: user.id }),
        episode: episode,
      });

      await episodeEntry.save();

      EpisodeEntry.redux.sync(dispatch, episodeEntry, {
        episode: episode,
      });
    };

    await Promise.all(previousUnwatched.map(async (value) => {
      if (value instanceof Episode) {
        const episode = value;

        onUpdatingChange({ [episode.id]: true });

        updateEpisodeEntry(episode)
          .catch((err) => console.error(err))
          .finally(() => onUpdatingChange({ [episode.id]: false }));
      }
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

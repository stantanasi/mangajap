import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from '../../../components/atoms/Modal';
import { AuthContext } from '../../../contexts/AuthContext';
import { Chapter, ChapterEntry, User, Volume, VolumeEntry } from '../../../models';
import { useAppDispatch } from '../../../redux/store';

type Props = {
  previousUnread: (Volume | Chapter)[];
  onUpdatingChange: (updating: { [id: string]: boolean }) => void;
  onRequestClose: () => void;
  visible: boolean;
}

export default function MarkPreviousAsReadModal({
  previousUnread,
  onUpdatingChange,
  onRequestClose,
  visible,
}: Props) {
  const dispatch = useAppDispatch();
  const { user } = useContext(AuthContext);

  const markPreviousAsRead = async () => {
    if (!user) return

    const updateVolumeEntry = async (volume: Volume) => {
      const volumeEntry = new VolumeEntry({
        user: new User({ id: user.id }),
        volume: volume,
      });

      await volumeEntry.save();

      VolumeEntry.redux.sync(dispatch, volumeEntry, {
        volume: volume,
      });
    };

    const updateChapterEntry = async (chapter: Chapter) => {
      const chapterEntry = new ChapterEntry({
        user: new User({ id: user.id }),
        chapter: chapter,
      });

      await chapterEntry.save();

      ChapterEntry.redux.sync(dispatch, chapterEntry, {
        chapter: chapter,
      });
    };

    await Promise.all(previousUnread.map(async (value) => {
      if (value instanceof Volume) {
        const volume = value;

        onUpdatingChange({ [volume.id]: true });

        updateVolumeEntry(volume)
          .catch((err) => console.error(err))
          .finally(() => onUpdatingChange({ [volume.id]: false }));
      } else {
        const chapter = value;

        onUpdatingChange({ [chapter.id]: true });

        updateChapterEntry(chapter)
          .catch((err) => console.error(err))
          .finally(() => onUpdatingChange({ [chapter.id]: false }));
      }
    }));
  };

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
        Marquer les volumes et chapitres précédents ?
      </Text>

      <Text>
        Voulez-vous marquer les volumes et chapitres précédents comme lus ?
      </Text>

      <View style={{ alignSelf: 'flex-end', flexDirection: 'row', gap: 16 }}>
        <Text
          onPress={() => {
            onRequestClose();
            markPreviousAsRead();
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
    </Modal >
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
});

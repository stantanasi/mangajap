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

    onUpdatingChange(Object.fromEntries(previousUnread.map((value) => [value.id, true])));

    await Promise.all(previousUnread.map(async (value) => {
      if (value instanceof Volume) {
        const volume = value;

        const volumeEntry = new VolumeEntry({
          user: new User({ id: user.id }),
          volume: volume,
        });

        await volumeEntry.save()
          .then((entry) => {
            dispatch(VolumeEntry.redux.actions.setOne(entry));
            dispatch(Volume.redux.actions.relations['volume-entry'].set(volume.id, entry));
          })
          .catch((err) => console.error(err));;
      } else {
        const chapter = value;

        const chapterEntry = new ChapterEntry({
          user: new User({ id: user!.id }),
          chapter: chapter,
        });

        await chapterEntry.save()
          .then((entry) => {
            dispatch(ChapterEntry.redux.actions.setOne(entry));
            dispatch(Chapter.redux.actions.relations['chapter-entry'].set(chapter.id, entry));
          })
          .catch((err) => console.error(err));
      }

      onUpdatingChange({ [value.id]: false });
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

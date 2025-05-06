import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from '../../../components/atoms/Modal';
import { AuthContext } from '../../../contexts/AuthContext';
import { Chapter, ChapterEntry, Manga, User, Volume, VolumeEntry } from '../../../models';

type Props = {
  manga: Manga;
  onMangaChange: (manga: Manga) => void;
  previousUnread: (Volume | Chapter)[];
  onUpdatingChange: (updating: { [id: string]: boolean }) => void;
  onRequestClose: () => void;
  visible: boolean;
}

export default function MarkPreviousAsReadModal({
  manga,
  onMangaChange,
  previousUnread,
  onUpdatingChange,
  onRequestClose,
  visible,
}: Props) {
  const { user } = useContext(AuthContext);

  const markPreviousAsRead = async () => {
    if (!user) return

    onUpdatingChange(Object.fromEntries(previousUnread!.map((value) => [value.id, true])));

    Promise.all(previousUnread.map(async (value) => {
      if (value instanceof Volume) {
        let volume = value;

        const volumeEntry = new VolumeEntry({
          user: new User({ id: user.id }),
          volume: volume,
        });

        volume = await volumeEntry.save()
          .then((entry) => volume.copy({ 'volume-entry': entry }))
          .catch((err) => {
            console.error(err);
            return volume;
          });;

        return volume;
      } else {
        let chapter = value;

        const chapterEntry = new ChapterEntry({
          user: new User({ id: user!.id }),
          chapter: chapter,
        });

        chapter = await chapterEntry.save()
          .then((entry) => chapter.copy({ 'chapter-entry': entry }))
          .catch((err) => {
            console.error(err);
            return chapter;
          });

        const volume = manga.volumes!.find((volume) => volume.chapters!.some((c) => c.id === chapter.id));
        if (volume) {
          onMangaChange(manga.copy({
            volumes: manga.volumes?.map((v) => v.id === volume.id
              ? volume.copy({
                chapters: volume.chapters?.map((c) => c.id === chapter.id ? chapter : c)
              })
              : v,
            ),
          }));
        } else {
          onMangaChange(manga.copy({
            chapters: manga.chapters?.map((c) => c.id === chapter.id ? chapter : c),
          }));
        }
      }

      onUpdatingChange({ [value.id]: false });
    }))
      .catch((err) => console.error(err));
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

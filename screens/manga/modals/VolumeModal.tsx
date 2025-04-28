import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import AutoHeightImage from '../../../components/atoms/AutoHeightImage';
import Checkbox from '../../../components/atoms/Checkbox';
import Modal from '../../../components/atoms/Modal';
import { AuthContext } from '../../../contexts/AuthContext';
import { ChapterEntry, User, Volume, VolumeEntry } from '../../../models';

type Props = {
  volume: Volume | undefined;
  onVolumeChange?: (volume: Volume) => void;
  onReadChange?: (value: boolean) => void;
  updating?: boolean;
  onUpdatingChange?: (value: boolean) => void;
  onChapterUpdatingChange?: (id: string, value: boolean) => void;
  onRequestClose: () => void;
  visible: boolean;
}

export default function VolumeModal({
  volume,
  onVolumeChange = () => { },
  onReadChange = () => { },
  updating = false,
  onUpdatingChange = () => { },
  onChapterUpdatingChange = () => { },
  onRequestClose,
  visible,
}: Props) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  if (!volume) {
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

  const updateVolumeEntry = async (value: boolean) => {
    if (!user) return

    if (value && !volume['volume-entry']) {
      const volumeEntry = new VolumeEntry({
        user: new User({ id: user.id }),
        volume: volume,
      });
      await volumeEntry.save();

      onVolumeChange(volume.copy({
        'volume-entry': volumeEntry,
      }));
    } else if (!value && volume['volume-entry']) {
      await volume['volume-entry'].delete();

      onVolumeChange(volume.copy({
        'volume-entry': null,
      }));
    }

    const chapters = await Promise.all(volume.chapters?.map(async (chapter, i) => {
      if (value && !chapter['chapter-entry']) {
        onChapterUpdatingChange(chapter.id, true);

        const chapterEntry = new ChapterEntry({
          user: new User({ id: user.id }),
          chapter: chapter,
        });

        return chapterEntry.save()
          .then((entry) => chapter.copy({ 'chapter-entry': entry }))
          .catch((err) => {
            console.error(err);
            return chapter;
          })
          .finally(() => onChapterUpdatingChange(chapter.id, false));
      } else if (!value && chapter['chapter-entry']) {
        onChapterUpdatingChange(chapter.id, true);

        return chapter['chapter-entry'].delete()
          .then(() => chapter.copy({ 'chapter-entry': null }))
          .catch((err) => {
            console.error(err);
            return chapter;
          })
          .finally(() => onChapterUpdatingChange(chapter.id, false));
      }

      return chapter;
    }) ?? []);

    onVolumeChange(volume.copy({
      chapters: chapters,
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
              navigation.navigate('VolumeUpdate', { volumeId: volume.id });
              onRequestClose();
            }}
            style={{
              padding: 12,
            }}
          />
        ) : null}
      </View>

      <AutoHeightImage
        source={{ uri: volume.cover ?? undefined }}
        style={styles.cover}
      />

      <Text style={styles.number}>
        Tome {volume.number}
      </Text>

      <Text style={styles.title}>
        {volume.title}
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
            {volume.publishedDate?.toLocaleDateString() ?? 'Indisponible'}
          </Text>
        </View>

        {user ? (
          <>
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: 4 }}>
              <MaterialIcons
                name="visibility"
                color={styles.date.color}
                size={20}
              />
              <Text style={styles.date}>
                {volume['volume-entry']?.readDate.toLocaleDateString() ?? 'Pas lu'}
              </Text>
            </View>

            <View style={{ flex: 1 }} />

            <Checkbox
              value={!!volume['volume-entry']}
              onValueChange={(value) => {
                onReadChange(value);
                onUpdatingChange(true);

                updateVolumeEntry(value)
                  .catch((err) => console.error(err))
                  .finally(() => onUpdatingChange(false));
              }}
              loading={updating}
            />
          </>
        ) : null}
      </View>

      <Text style={styles.overview}>
        {volume.overview || 'Synopsis non disponible'}
      </Text>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: '5%',
    minHeight: 100,
  },
  cover: {
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

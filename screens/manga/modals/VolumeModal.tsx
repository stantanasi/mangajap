import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import AutoHeightImage from '../../../components/atoms/AutoHeightImage';
import Checkbox from '../../../components/atoms/Checkbox';
import DateTimePicker from '../../../components/atoms/DateTimePicker';
import Modal from '../../../components/atoms/Modal';
import { AuthContext } from '../../../contexts/AuthContext';
import { Chapter, ChapterEntry, User, Volume, VolumeEntry } from '../../../models';
import { useAppDispatch } from '../../../redux/store';

type Props = {
  volume: Volume | undefined;
  onReadChange?: (value: boolean) => void;
  updating?: boolean;
  onUpdatingChange?: (value: boolean) => void;
  onChapterUpdatingChange?: (id: string, value: boolean) => void;
  onRequestClose: () => void;
  visible: boolean;
}

export default function VolumeModal({
  volume,
  onReadChange = () => { },
  updating = false,
  onUpdatingChange = () => { },
  onChapterUpdatingChange = () => { },
  onRequestClose,
  visible,
}: Props) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [readDatePickerVisible, setReadDatePickerVisible] = useState(false);
  const [isSavingReadDate, setIsSavingReadDate] = useState(false);

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

  const updateVolumeEntry = async (add: boolean) => {
    if (!user) return

    if (add && !volume['volume-entry']) {
      const volumeEntry = new VolumeEntry({
        user: new User({ id: user.id }),
        volume: volume,
      });
      await volumeEntry.save();

      VolumeEntry.redux.sync(dispatch, volumeEntry, {
        volume: volume,
      });
    } else if (!add && volume['volume-entry']) {
      await volume['volume-entry'].delete();

      VolumeEntry.redux.sync(dispatch, volume['volume-entry'], {
        volume: volume,
      });
    }

    const updateChapterEntry = async (chapter: Chapter) => {
      if (add && !chapter['chapter-entry']) {
        const chapterEntry = new ChapterEntry({
          user: new User({ id: user.id }),
          chapter: chapter,
        });
        await chapterEntry.save();

        ChapterEntry.redux.sync(dispatch, chapterEntry, {
          chapter: chapter,
        });
      } else if (!add && chapter['chapter-entry']) {
        await chapter['chapter-entry'].delete();

        ChapterEntry.redux.sync(dispatch, chapter['chapter-entry'], {
          chapter: chapter,
        });
      }
    };

    await Promise.all(volume.chapters?.map(async (chapter) => {
      onChapterUpdatingChange(chapter.id, true);

      await updateChapterEntry(chapter)
        .catch((err) => console.error(err))
        .finally(() => onChapterUpdatingChange(chapter.id, false));
    }) ?? []);
  };

  const updateReadDate = async (date: Date) => {
    if (!volume['volume-entry']) return

    volume['volume-entry'].readDate = date;
    await volume['volume-entry'].save();

    VolumeEntry.redux.sync(dispatch, volume['volume-entry'], {
      volume: volume,
    });
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
              {!isSavingReadDate ? (
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
                  if (!volume['volume-entry']) return
                  setReadDatePickerVisible(true);
                }}
                style={styles.date}
              >
                {volume['volume-entry']?.readDate.toLocaleDateString() ?? 'Pas vu'}
              </Text>

              {volume['volume-entry'] ? (
                <DateTimePicker
                  value={volume['volume-entry'].readDate}
                  onValueChange={(value) => {
                    setIsSavingReadDate(true);

                    updateReadDate(value)
                      .catch((err) => console.error(err))
                      .finally(() => setIsSavingReadDate(false))
                  }}
                  onRequestClose={() => setReadDatePickerVisible(false)}
                  visible={readDatePickerVisible}
                />
              ) : null}
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

      <Text>
        Chapitres {volume.chapters?.[0]?.number} - {volume.chapters?.[volume.chapters!.length - 1]?.number}
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

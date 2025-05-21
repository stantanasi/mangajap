import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import AutoHeightImage from '../../../components/atoms/AutoHeightImage';
import Checkbox from '../../../components/atoms/Checkbox';
import DateTimePicker from '../../../components/atoms/DateTimePicker';
import Modal from '../../../components/atoms/Modal';
import { AuthContext } from '../../../contexts/AuthContext';
import { Chapter, ChapterEntry, User } from '../../../models';
import { useAppDispatch } from '../../../redux/store';

type Props = {
  chapter: Chapter | undefined;
  onChapterChange?: (chapter: Chapter) => void;
  onReadChange?: (value: boolean) => void;
  updating?: boolean;
  onUpdatingChange?: (value: boolean) => void;
  onRequestClose: () => void;
  visible: boolean;
}

export default function ChapterModal({
  chapter,
  onChapterChange = () => { },
  onReadChange = () => { },
  updating = false,
  onUpdatingChange = () => { },
  onRequestClose,
  visible,
}: Props) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [readDatePickerVisible, setReadDatePickerVisible] = useState(false);
  const [isSavingReadDate, setIsSavingReadDate] = useState(false);

  if (!chapter) {
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

  const updateChapterEntry = async (add: boolean) => {
    if (!user) return

    const chapterEntry = await (async () => {
      if (add && !chapter['chapter-entry']) {
        const chapterEntry = new ChapterEntry({
          user: new User({ id: user.id }),
          chapter: chapter,
        });
        await chapterEntry.save();

        dispatch(ChapterEntry.redux.actions.setOne(chapterEntry));
        dispatch(Chapter.redux.actions.relations['chapter-entry'].set(chapter.id, chapterEntry));

        return chapterEntry;
      } else if (!add && chapter['chapter-entry']) {
        await chapter['chapter-entry'].delete();

        dispatch(ChapterEntry.redux.actions.removeOne(chapter['chapter-entry']));
        dispatch(Chapter.redux.actions.relations['chapter-entry'].remove(chapter.id, chapter['chapter-entry']));

        return null;
      }

      return chapter['chapter-entry'];
    })()
      .catch((err) => {
        console.error(err);
        return chapter['chapter-entry'];
      });

    onChapterChange(chapter.copy({
      'chapter-entry': chapterEntry,
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
              navigation.navigate('ChapterUpdate', { chapterId: chapter.id });
              onRequestClose();
            }}
            style={{
              padding: 12,
            }}
          />
        ) : null}
      </View>

      <AutoHeightImage
        source={{ uri: chapter.cover ?? undefined }}
        style={styles.cover}
      />

      <Text style={styles.number}>
        Chapitre {chapter.number}
      </Text>

      <Text style={styles.title}>
        {chapter.title}
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
            {chapter.publishedDate?.toLocaleDateString() ?? 'Indisponible'}
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
                  if (!chapter['chapter-entry']) return
                  setReadDatePickerVisible(true);
                }}
                style={styles.date}
              >
                {chapter['chapter-entry']?.readDate.toLocaleDateString() ?? 'Pas vu'}
              </Text>

              {chapter['chapter-entry'] ? (
                <DateTimePicker
                  value={chapter['chapter-entry'].readDate}
                  onValueChange={(value) => {
                    setIsSavingReadDate(true);

                    const updateReadDate = async () => {
                      const chapterEntry = chapter['chapter-entry']!.copy({
                        readDate: value,
                      });
                      await chapterEntry.save();

                      dispatch(ChapterEntry.redux.actions.setOne(chapterEntry));

                      onChapterChange(chapter.copy({
                        'chapter-entry': chapterEntry,
                      }));
                    };

                    updateReadDate()
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
              value={!!chapter['chapter-entry']}
              onValueChange={(value) => {
                onReadChange(value);
                onUpdatingChange(true);

                updateChapterEntry(value)
                  .catch((err) => console.error(err))
                  .finally(() => onUpdatingChange(false));
              }}
              loading={updating}
            />
          </>
        ) : null}
      </View>

      <Text style={styles.overview}>
        {chapter.overview || 'Synopsis non disponible'}
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

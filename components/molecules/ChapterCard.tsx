import React, { useContext } from 'react';
import { Image, Pressable, PressableProps, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Chapter, ChapterEntry, User } from '../../models';
import { useAppDispatch } from '../../redux/store';
import Checkbox from '../atoms/Checkbox';

type Props = PressableProps & {
  chapter: Chapter;
  onReadChange?: (value: boolean) => void;
  updating?: boolean;
  onUpdatingChange?: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

export default function ChapterCard({
  chapter,
  onReadChange = () => { },
  updating = false,
  onUpdatingChange = () => { },
  style,
  ...props
}: Props) {
  const dispatch = useAppDispatch();
  const { user } = useContext(AuthContext);

  const updateChapterEntry = async (add: boolean) => {
    if (!user) return

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

  return (
    <Pressable
      {...props}
      style={[styles.container, style]}
    >
      <Image
        source={{ uri: chapter.cover ?? undefined }}
        style={styles.cover}
      />

      <View style={{ flex: 1, margin: 10 }}>
        <Text style={styles.number}>
          Chapitre {chapter.number}
        </Text>

        <Text style={styles.title}>
          {chapter.title}
        </Text>
      </View>

      {user ? (
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
          style={{
            marginRight: 10,
          }}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  cover: {
    width: 60,
    aspectRatio: 2 / 3,
    backgroundColor: '#ccc',
  },
  number: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {},
});

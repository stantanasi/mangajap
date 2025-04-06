import Checkbox from 'expo-checkbox';
import React, { useContext } from 'react';
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Chapter, ChapterEntry, User } from '../../models';

type Props = {
  chapter: Chapter;
  onChapterChange: (chapter: Chapter) => void;
  style?: ViewStyle;
}

export default function ChapterCard({ chapter, onChapterChange, style }: Props) {
  const { user } = useContext(AuthContext);

  const isRead = !!chapter['chapter-entry'];

  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri: chapter.cover ?? undefined }}
        style={styles.cover}
      />

      <View style={{ flex: 1, padding: 10 }}>
        <Text style={styles.number}>
          Chapitre {chapter.number}
        </Text>

        <Text style={styles.title}>
          {chapter.title}
        </Text>
      </View>

      {user ? (
        <Checkbox
          value={isRead}
          onValueChange={async (value) => {
            if (value) {
              const chapterEntry = new ChapterEntry({
                user: new User({ id: user.id }),
                chapter: chapter,
              });
              await chapterEntry.save();

              onChapterChange(chapter.copy({
                'chapter-entry': chapterEntry,
              }));
            } else {
              await chapter['chapter-entry']?.delete();

              onChapterChange(chapter.copy({
                'chapter-entry': null,
              }));
            }
          }}
          style={{
            marginRight: 10,
          }}
        />
      ) : null}
    </View>
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

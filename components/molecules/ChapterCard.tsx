import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Chapter, ChapterEntry, User } from '../../models';

type Props = {
  chapter: Chapter;
  onChapterChange: (chapter: Chapter) => void;
  updating?: boolean;
  style?: ViewStyle;
}

export default function ChapterCard({ chapter, onChapterChange, updating = false, style }: Props) {
  const { user } = useContext(AuthContext);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsUpdating(updating);
  }, [updating]);

  const isRead = !!chapter['chapter-entry'];

  return (
    <View style={[styles.container, style]}>
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
        <View
          style={{
            backgroundColor: !isRead ? '#e5e5e5' : '#4281f5',
            borderRadius: 360,
            padding: 8,
            marginRight: 10,
          }}
        >
          {!isUpdating ? (
            <MaterialIcons
              name="check"
              size={20}
              color={!isRead ? '#7e7e7e' : '#fff'}
              onPress={() => {
                setIsUpdating(true);

                const updateChapterEntry = async () => {
                  if (!isRead && !chapter['chapter-entry']) {
                    const chapterEntry = new ChapterEntry({
                      user: new User({ id: user.id }),
                      chapter: chapter,
                    });
                    await chapterEntry.save();

                    onChapterChange(chapter.copy({
                      'chapter-entry': chapterEntry,
                    }));
                  } else if (isRead && chapter['chapter-entry']) {
                    await chapter['chapter-entry'].delete();

                    onChapterChange(chapter.copy({
                      'chapter-entry': null,
                    }));
                  }
                };

                updateChapterEntry()
                  .catch((err) => console.error(err))
                  .finally(() => setIsUpdating(false));
              }}
            />
          ) : (
            <ActivityIndicator
              animating
              color="#fff"
              size={20}
            />
          )}
        </View>
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

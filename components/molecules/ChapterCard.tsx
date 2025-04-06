import React from 'react';
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Chapter } from '../../models';

type Props = {
  chapter: Chapter;
  style?: ViewStyle;
}

export default function ChapterCard({ chapter, style }: Props) {
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

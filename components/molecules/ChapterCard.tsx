import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Chapter } from '../../models';

type Props = {
  chapter: Chapter;
}

export default function ChapterCard({ chapter }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.number}>
        Chapitre {chapter.number}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  number: {},
});

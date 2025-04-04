import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Volume } from '../../models';
import ChapterCard from './ChapterCard';

type Props = {
  volume: Volume;
}

export default function VolumeCard({ volume }: Props) {
  const [showChapters, setShowChapters] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setShowChapters((prev) => !prev)}
      >
        <Text style={styles.number}>
          Tome {volume.number}
        </Text>
      </Pressable>

      {showChapters && volume.chapters?.map((chapter) => (
        <ChapterCard
          key={chapter.id}
          chapter={chapter}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  number: {},
});

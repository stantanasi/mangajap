import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Volume } from '../../models';
import ProgressBar from '../atoms/ProgressBar';
import ChapterCard from './ChapterCard';

type Props = {
  volume: Volume;
  style?: ViewStyle;
}

export default function VolumeCard({ volume, style }: Props) {
  const [showChapters, setShowChapters] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <Pressable
        onPress={() => setShowChapters((prev) => !prev)}
        style={{
          backgroundColor: '#fff',
          borderRadius: 4,
          overflow: 'hidden',
          marginBottom: 6,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Image
            source={{ uri: volume.cover ?? undefined }}
            resizeMode="cover"
            style={styles.cover}
          />

          <View style={{ flex: 1, padding: 10 }}>
            <Text style={styles.number}>
              Tome {volume.number}
            </Text>

            <Text style={styles.published}>
              {volume.publishedDate?.toLocaleDateString()}
            </Text>

            <Text style={styles.title}>
              {volume.title}
            </Text>
          </View>

          <MaterialIcons
            name={showChapters ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={24}
            color="black"
            style={{
              marginRight: 14,
            }}
          />

          <Text
            style={{
              marginRight: 12,
            }}
          >
            {volume.chapters?.filter((chapter) => !!chapter['chapter-entry']).length ?? 0} / {volume.chapters?.length ?? 0}
          </Text>
        </View>

        <ProgressBar
          progress={100 * (volume.chapters?.filter((chapter) => !!chapter['chapter-entry']).length ?? 0) / (volume.chapters?.length ?? 0)}
        />
      </Pressable>

      <View style={{ gap: 6 }}>
        {showChapters && volume.chapters?.map((chapter) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            onChapterChange={(chapter) => { }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  cover: {
    width: 90,
    aspectRatio: 2 / 3,
    backgroundColor: '#ccc',
  },
  published: {
    color: '#888',
    fontSize: 12,
  },
  number: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    marginTop: 4,
  },
});

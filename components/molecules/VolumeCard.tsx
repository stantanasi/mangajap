import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Checkbox from 'expo-checkbox';
import React, { useContext, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { ChapterEntry, User, Volume, VolumeEntry } from '../../models';
import ProgressBar from '../atoms/ProgressBar';
import ChapterCard from './ChapterCard';

type Props = {
  volume: Volume;
  onVolumeChange: (volume: Volume) => void;
  style?: ViewStyle;
}

export default function VolumeCard({ volume, onVolumeChange, style }: Props) {
  const { user } = useContext(AuthContext);
  const [showChapters, setShowChapters] = useState(false);

  const chaptersReadCount = volume.chapters?.filter((chapter) => !!chapter['chapter-entry']).length ?? 0;
  const chaptersCount = volume.chapters?.length ?? 0;

  const isRead = !!volume['volume-entry'] || chaptersCount > 0 && chaptersReadCount == chaptersCount;
  const progress = chaptersCount > 0
    ? (chaptersReadCount / chaptersCount) * 100
    : isRead ? 100 : 0;

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
            {chaptersReadCount} / {chaptersCount}
          </Text>

          {user ? (
            <Checkbox
              value={isRead}
              onValueChange={async (value) => {
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

                onVolumeChange(volume.copy({
                  chapters: await Promise.all(volume.chapters?.map(async (chapter) => {
                    if (value && !chapter['chapter-entry']) {
                      const chapterEntry = new ChapterEntry({
                        user: new User({ id: user.id }),
                        chapter: chapter,
                      });
                      await chapterEntry.save();

                      return chapter.copy({
                        'chapter-entry': chapterEntry,
                      });
                    } else if (!value && chapter['chapter-entry']) {
                      await chapter['chapter-entry'].delete();

                      return chapter.copy({
                        'chapter-entry': null,
                      });
                    }

                    return chapter;
                  }) ?? []),
                }));
              }}
              style={{
                marginRight: 10,
              }}
            />
          ) : null}
        </View>

        <ProgressBar
          progress={progress}
        />
      </Pressable>

      <View style={{ gap: 6 }}>
        {showChapters && volume.chapters?.map((chapter) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            onChapterChange={(chapter) => {
              onVolumeChange(volume.copy({
                chapters: volume.chapters?.map((c) => c.id === chapter.id ? chapter : c),
              }));
            }}
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

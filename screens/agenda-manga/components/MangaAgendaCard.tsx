import React from 'react';
import { Image, Pressable, PressableProps, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import ProgressBar from '../../../components/atoms/ProgressBar';
import { Manga } from '../../../models';

type Props = PressableProps & {
  manga: Manga;
  style?: StyleProp<ViewStyle>;
}

export default function MangaAgendaCard({ manga, style, ...props }: Props) {
  const volumeReadCount = manga['manga-entry']?.volumesRead ?? 0;
  const chapterReadCount = manga['manga-entry']?.chaptersRead ?? 0;

  const progress = manga.chapterCount > 0
    ? (chapterReadCount / manga.chapterCount) * 100
    : (volumeReadCount / manga.volumeCount) * 100;

  return (
    <Pressable
      {...props}
      style={[styles.container, style]}
    >
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={{ uri: manga.poster ?? undefined }}
          resizeMode="cover"
          style={styles.image}
        />

        <View
          style={{
            alignItems: 'center',
            flex: 1,
            flexDirection: 'row',
            padding: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              {manga.title}
            </Text>
          </View>

          <View style={{ gap: 4 }}>
            {manga.volumeCount > 0 && (
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: '#666', fontSize: 11 }}>
                  Volumes
                </Text>
                <Text>
                  {volumeReadCount} / {manga.volumeCount}
                </Text>
              </View>
            )}

            {manga.chapterCount > 0 && (
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: '#666', fontSize: 12 }}>
                  Chapitres
                </Text>
                <Text>
                  {chapterReadCount} / {manga.chapterCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <ProgressBar
        progress={progress}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: 80,
    aspectRatio: 2 / 3,
    backgroundColor: '#ccc',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useContext } from 'react';
import { ActivityIndicator, Image, Pressable, PressableProps, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { ChapterEntry, User, Volume, VolumeEntry } from '../../models';
import ProgressBar from '../atoms/ProgressBar';

type Props = PressableProps & {
  volume: Volume;
  onVolumeChange?: (volume: Volume) => void;
  updating?: boolean;
  onUpdatingChange?: (value: boolean) => void;
  expanded?: boolean;
  style?: ViewStyle;
}

export default function VolumeCard({
  volume,
  onVolumeChange = () => { },
  updating = false,
  onUpdatingChange = () => { },
  expanded = false,
  style,
  ...props
}: Props) {
  const { user } = useContext(AuthContext);

  const chaptersReadCount = volume.chapters?.filter((chapter) => !!chapter['chapter-entry']).length ?? 0;
  const chaptersCount = volume.chapters?.length ?? 0;

  const isRead = !!volume['volume-entry'] || chaptersCount > 0 && chaptersReadCount == chaptersCount;
  const progress = chaptersCount > 0
    ? (chaptersReadCount / chaptersCount) * 100
    : isRead ? 100 : 0;

  return (
    <Pressable
      {...props}
      style={[styles.container, style]}
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
          name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
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
          <View
            style={{
              backgroundColor: !isRead ? '#e5e5e5' : '#4281f5',
              borderRadius: 360,
              padding: 8,
              marginRight: 10,
            }}
          >
            {!updating ? (
              <MaterialIcons
                name="check"
                size={20}
                color={!isRead ? '#7e7e7e' : '#fff'}
                onPress={() => {
                  onUpdatingChange(true);

                  const updateVolumeEntry = async () => {
                    if (!isRead && !volume['volume-entry']) {
                      const volumeEntry = new VolumeEntry({
                        user: new User({ id: user.id }),
                        volume: volume,
                      });
                      await volumeEntry.save();

                      onVolumeChange(volume.copy({
                        'volume-entry': volumeEntry,
                      }));
                    } else if (isRead && volume['volume-entry']) {
                      await volume['volume-entry'].delete();

                      onVolumeChange(volume.copy({
                        'volume-entry': null,
                      }));
                    }
                  };

                  const updateVolumeChaptersEntries = async () => {
                    const chapters = await Promise.all(volume.chapters?.map(async (chapter, i) => {
                      if (!isRead && !chapter['chapter-entry']) {
                        const chapterEntry = new ChapterEntry({
                          user: new User({ id: user.id }),
                          chapter: chapter,
                        });

                        return chapterEntry.save()
                          .then((entry) => chapter.copy({ 'chapter-entry': entry }))
                          .catch((err) => {
                            console.error(err);
                            return chapter;
                          });
                      } else if (isRead && chapter['chapter-entry']) {
                        return chapter['chapter-entry'].delete()
                          .then(() => chapter.copy({ 'chapter-entry': null }))
                          .catch((err) => {
                            console.error(err);
                            return chapter;
                          });
                      }

                      return chapter;
                    }) ?? []);

                    onVolumeChange(volume.copy({
                      chapters: chapters,
                    }));
                  };

                  updateVolumeEntry()
                    .then(() => updateVolumeChaptersEntries())
                    .catch((err) => console.error(err))
                    .finally(() => onUpdatingChange(false));
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

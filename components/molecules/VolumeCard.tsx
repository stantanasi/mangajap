import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Image, Pressable, PressableProps, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Chapter, ChapterEntry, User, Volume, VolumeEntry } from '../../models';
import { useAppDispatch } from '../../redux/store';
import notify from '../../utils/notify';
import Checkbox from '../atoms/Checkbox';
import ProgressBar from '../atoms/ProgressBar';

type Props = PressableProps & {
  isLoading: boolean;
  volume: Volume;
  onReadChange?: (value: boolean) => void;
  updating?: boolean;
  onUpdatingChange?: (value: boolean) => void;
  onChapterUpdatingChange?: (id: string, value: boolean) => void;
  expanded?: boolean;
  onExpandedChange?: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

export default function VolumeCard({
  isLoading,
  volume,
  onReadChange = () => { },
  updating = false,
  onUpdatingChange = () => { },
  onChapterUpdatingChange = () => { },
  expanded = false,
  onExpandedChange = () => { },
  style,
  ...props
}: Props) {
  const dispatch = useAppDispatch();
  const { isOffline } = useApp();
  const { user } = useAuth();

  const updateVolumeEntry = async (add: boolean) => {
    if (!user) return;

    if (add && !volume['volume-entry']) {
      const volumeEntry = new VolumeEntry({
        user: new User({ id: user.id }),
        volume: volume,
      });
      await volumeEntry.save();

      VolumeEntry.redux.sync(dispatch, volumeEntry, {
        volume: volume,
      });
    } else if (!add && volume['volume-entry']) {
      await volume['volume-entry'].delete();

      VolumeEntry.redux.sync(dispatch, volume['volume-entry'], {
        volume: volume,
      });
    }

    const updateChapterEntry = async (chapter: Chapter) => {
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

    await Promise.all(volume.chapters?.map(async (chapter) => {
      onChapterUpdatingChange(chapter.id, true);

      await updateChapterEntry(chapter)
        .catch((err) => notify.error('chapter_entry_update', err))
        .finally(() => onChapterUpdatingChange(chapter.id, false));
    }) ?? []);
  };

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
          onPress={() => onExpandedChange(!expanded)}
          style={{
            marginRight: 14,
          }}
        />

        <Text
          style={{
            marginRight: 12,
          }}
        >
          {volume.chapterReadCount} / {volume.chapterCount}
        </Text>

        {!isOffline && !isLoading && user ? (
          <Checkbox
            value={!!volume['volume-entry']}
            onValueChange={(value) => {
              onReadChange(value);
              onUpdatingChange(true);

              updateVolumeEntry(value)
                .catch((err) => notify.error('volume_entry_update', err))
                .finally(() => onUpdatingChange(false));
            }}
            loading={updating}
            style={{
              marginRight: 10,
            }}
          />
        ) : null}
      </View>

      <ProgressBar
        progress={volume.progress}
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

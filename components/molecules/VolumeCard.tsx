import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useContext } from 'react';
import { Image, Pressable, PressableProps, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Chapter, ChapterEntry, User, Volume, VolumeEntry } from '../../models';
import { useAppDispatch } from '../../redux/store';
import Checkbox from '../atoms/Checkbox';
import ProgressBar from '../atoms/ProgressBar';

type Props = PressableProps & {
  volume: Volume;
  onReadChange?: (value: boolean) => void;
  updating?: boolean;
  onUpdatingChange?: (value: boolean) => void;
  onChapterUpdatingChange?: (id: string, value: boolean) => void;
  expanded?: boolean;
  onExpandedChange?: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

export default function VolumeCard({
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
  const { user } = useContext(AuthContext);

  const chaptersReadCount = volume.chapters?.filter((chapter) => !!chapter['chapter-entry']).length ?? 0;
  const chaptersCount = volume.chapters?.length ?? 0;

  const progress = chaptersCount > 0
    ? (chaptersReadCount / chaptersCount) * 100
    : volume['volume-entry'] ? 100 : 0;

  const updateVolumeEntry = async (add: boolean) => {
    if (!user) return

    if (add && !volume['volume-entry']) {
      const volumeEntry = new VolumeEntry({
        user: new User({ id: user.id }),
        volume: volume,
      });
      await volumeEntry.save();

      dispatch(VolumeEntry.redux.actions.saveOne(volumeEntry));
      dispatch(Volume.redux.actions.relations['volume-entry'].set(volume.id, volumeEntry));
    } else if (!add && volume['volume-entry']) {
      await volume['volume-entry'].delete();

      dispatch(VolumeEntry.redux.actions.removeOne(volume['volume-entry']));
      dispatch(Volume.redux.actions.relations['volume-entry'].remove(volume.id, volume['volume-entry']));
    }

    const updateChapterEntry = async (chapter: Chapter) => {
      if (add && !chapter['chapter-entry']) {
        const chapterEntry = new ChapterEntry({
          user: new User({ id: user.id }),
          chapter: chapter,
        });
        await chapterEntry.save();

        dispatch(ChapterEntry.redux.actions.saveOne(chapterEntry));
        dispatch(Chapter.redux.actions.relations['chapter-entry'].set(chapter.id, chapterEntry));
      } else if (!add && chapter['chapter-entry']) {
        await chapter['chapter-entry'].delete();

        dispatch(ChapterEntry.redux.actions.removeOne(chapter['chapter-entry']));
        dispatch(Chapter.redux.actions.relations['chapter-entry'].remove(chapter.id, chapter['chapter-entry']));
      }
    };

    await Promise.all(volume.chapters?.map(async (chapter) => {
      onChapterUpdatingChange(chapter.id, true);

      await updateChapterEntry(chapter)
        .catch((err) => console.error(err))
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
          {chaptersReadCount} / {chaptersCount}
        </Text>

        {user ? (
          <Checkbox
            value={!!volume['volume-entry']}
            onValueChange={(value) => {
              onReadChange(value);
              onUpdatingChange(true);

              updateVolumeEntry(value)
                .catch((err) => console.error(err))
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

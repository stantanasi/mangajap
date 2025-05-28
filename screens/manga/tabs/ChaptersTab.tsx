import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { SectionList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import ChapterCard from '../../../components/molecules/ChapterCard';
import ExpandableFloatingActionButton from '../../../components/molecules/ExpandableFloatingActionButton';
import VolumeCard from '../../../components/molecules/VolumeCard';
import { AuthContext } from '../../../contexts/AuthContext';
import { Chapter, Manga, Volume } from '../../../models';
import ChapterModal from '../modals/ChapterModal';
import MarkPreviousAsReadModal from '../modals/MarkPreviousAsReadModal';
import VolumeModal from '../modals/VolumeModal';

type Props = {
  manga: Manga;
  style?: StyleProp<ViewStyle>;
}

export default function ChaptersTab({ manga, style }: Props) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [expandedVolumes, setExpandedVolumes] = useState<{ [volumeId: string]: boolean }>({});
  const [updating, setUpdating] = useState<{ [id: string]: boolean }>({});
  const [selectedVolume, setSelectedVolume] = useState<Volume>();
  const [selectedChapter, setSelectedChapter] = useState<Chapter>();
  const [previousUnread, setPreviousUnread] = useState<(Volume | Chapter)[]>();

  const findPreviousVolumesChapters = (item: Volume | Chapter): (Volume | Chapter)[] => {
    const sections = [
      ...manga.volumes!.map((volume) => ({
        volume: volume,
        data: volume.chapters!,
      })),
      {
        volume: null,
        data: manga.chapters!.filter((chapter) => !manga.volumes!.some((v) => v.chapters!.some((c) => c.id === chapter.id))),
      },
    ];

    const previous: (Volume | Chapter)[] = [];

    for (const section of sections) {
      if (section.volume && section.volume.id === item.id) {
        return previous;
      }

      for (const chapter of section.data) {
        if (chapter.id === item.id) {
          return previous;
        }
        previous.push(chapter);
      }

      if (section.volume) {
        previous.push(section.volume);
      }
    }

    return previous;
  };

  return (
    <View style={[styles.container, style]}>
      <SectionList
        sections={[
          ...manga.volumes!.map((volume) => ({
            volume: volume,
            data: expandedVolumes[volume.id] ? volume.chapters! : [],
          })),
          {
            volume: null,
            data: manga.chapters!.filter((chapter) => !manga.volumes!.some((v) => v.chapters!.some((c) => c.id === chapter.id))),
          },
        ]}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { volume } }) => !volume ? null : (
          <VolumeCard
            volume={volume}
            onReadChange={(value) => {
              if (!value) return

              const previousUnread = findPreviousVolumesChapters(volume)
                .filter((value) => value instanceof Volume
                  ? !value['volume-entry']
                  : !value['chapter-entry']
                );

              if (previousUnread.length > 0) {
                setPreviousUnread(previousUnread);
              }
            }}
            updating={updating[volume.id]}
            onUpdatingChange={(value) => setUpdating((prev) => ({ ...prev, [volume.id]: value }))}
            onChapterUpdatingChange={(id, value) => setUpdating((prev) => ({ ...prev, [id]: value }))}
            expanded={expandedVolumes[volume.id]}
            onExpandedChange={() => setExpandedVolumes((prev) => ({ ...prev, [volume.id]: !prev[volume.id] }))}
            onPress={() => setSelectedVolume(volume)}
            style={{
              marginTop: 5,
              marginHorizontal: 16,
            }}
          />
        )}
        renderSectionFooter={() => <View style={{ height: 5 }} />}
        renderItem={({ item, section: { volume } }) => (
          <ChapterCard
            chapter={item}
            onReadChange={(value) => {
              if (!value) return

              const previousUnread = findPreviousVolumesChapters(item)
                .filter((value) => value instanceof Volume
                  ? !value['volume-entry']
                  : !value['chapter-entry']
                );

              if (previousUnread.length > 0) {
                setPreviousUnread(previousUnread);
              }
            }}
            updating={updating[item.id]}
            onUpdatingChange={(value) => setUpdating((prev) => ({ ...prev, [item.id]: value }))}
            onPress={() => setSelectedChapter(item.copy({ volume: volume }))}
            style={{
              marginHorizontal: 16,
            }}
          />
        )}
        SectionSeparatorComponent={() => <View style={{ height: 10 }} />}
        ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
        removeClippedSubviews
        contentContainerStyle={{
          paddingVertical: 11,
        }}
      />

      {user && user.isAdmin ? (
        <ExpandableFloatingActionButton
          icon="add"
          menuItems={[
            {
              icon: 'library-add',
              label: 'Tome',
              onPress: () => navigation.navigate('VolumeCreate', { mangaId: manga.id }),
            },
            {
              icon: 'library-add',
              label: 'Chapitre',
              onPress: () => navigation.navigate('ChapterCreate', { mangaId: manga.id }),
            },
          ]}
        />
      ) : null}

      <VolumeModal
        volume={selectedVolume}
        onReadChange={(value) => {
          if (!value) return

          const previousUnread = findPreviousVolumesChapters(selectedVolume!)
            .filter((value) => value instanceof Volume
              ? !value['volume-entry']
              : !value['chapter-entry']
            );

          if (previousUnread.length > 0) {
            setPreviousUnread(previousUnread);
          }
        }}
        updating={selectedVolume ? updating[selectedVolume.id] : false}
        onUpdatingChange={(value) => setUpdating((prev) => ({ ...prev, [selectedVolume!.id]: value }))}
        onChapterUpdatingChange={(id, value) => setUpdating((prev) => ({ ...prev, [id]: value }))}
        onRequestClose={() => setSelectedVolume(undefined)}
        visible={!!selectedVolume}
      />

      <ChapterModal
        chapter={selectedChapter}
        onReadChange={(value) => {
          if (!value) return

          const previousUnread = findPreviousVolumesChapters(selectedChapter!)
            .filter((value) => value instanceof Volume
              ? !value['volume-entry']
              : !value['chapter-entry']
            );

          if (previousUnread.length > 0) {
            setPreviousUnread(previousUnread);
          }
        }}
        updating={selectedChapter ? updating[selectedChapter.id] : false}
        onUpdatingChange={(value) => setUpdating((prev) => ({ ...prev, [selectedChapter!.id]: value }))}
        onRequestClose={() => setSelectedChapter(undefined)}
        visible={!!selectedChapter}
      />

      <MarkPreviousAsReadModal
        previousUnread={previousUnread ?? []}
        onUpdatingChange={(updating) => setUpdating((prev) => ({ ...prev, ...updating }))}
        onRequestClose={() => setPreviousUnread(undefined)}
        visible={!!previousUnread}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { Modal, Pressable, SectionList, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import ChapterCard from '../../../components/molecules/ChapterCard';
import VolumeCard from '../../../components/molecules/VolumeCard';
import { AuthContext } from '../../../contexts/AuthContext';
import { Chapter, ChapterEntry, Manga, User, Volume, VolumeEntry } from '../../../models';

type Props = {
  manga: Manga;
  onMangaChange: (manga: Manga) => void;
  style?: StyleProp<ViewStyle>;
}

export default function VolumesTab({ manga, onMangaChange, style }: Props) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [expandedVolumes, setExpandedVolumes] = useState<{ [volumeId: string]: boolean }>({});
  const [updating, setUpdating] = useState<{ [id: string]: boolean }>({});
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
            onVolumeChange={(volume) => {
              onMangaChange(manga.copy({
                volumes: manga.volumes?.map((v) => v.id === volume.id ? volume : v),
              }));
            }}
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
            onPress={() => setExpandedVolumes((prev) => ({ ...prev, [volume.id]: !prev[volume.id] }))}
            expanded={expandedVolumes[volume.id]}
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
            onChapterChange={(chapter) => {
              if (volume) {
                onMangaChange(manga.copy({
                  volumes: manga.volumes?.map((v) => v.id === volume.id
                    ? volume.copy({
                      chapters: volume.chapters?.map((c) => c.id === chapter.id ? chapter : c)
                    })
                    : v,
                  ),
                }));
              } else {
                onMangaChange(manga.copy({
                  chapters: manga.chapters?.map((c) => c.id === chapter.id ? chapter : c),
                }));
              }
            }}
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
            style={{
              marginHorizontal: 16,
            }}
          />
        )}
        SectionSeparatorComponent={() => <View style={{ height: 10 }} />}
        ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
        ListFooterComponent={() => (
          <View style={{ gap: 12 }}>
            <Pressable
              onPress={() => navigation.navigate('VolumeCreate', { mangaId: manga.id })}
              style={{
                backgroundColor: '#ddd',
                borderRadius: 6,
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 10,
                marginHorizontal: 16,
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              <MaterialIcons
                name="add"
                color="#000"
                size={24}
              />
              <Text
                style={{
                  fontSize: 16,
                }}
              >
                Ajouter un tome
              </Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate('ChapterCreate', { mangaId: manga.id })}
              style={{
                backgroundColor: '#ddd',
                borderRadius: 6,
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 10,
                marginHorizontal: 16,
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              <MaterialIcons
                name="add"
                color="#000"
                size={24}
              />
              <Text
                style={{
                  fontSize: 16,
                }}
              >
                Ajouter un chapitre
              </Text>
            </Pressable>
          </View>
        )}
        removeClippedSubviews
        contentContainerStyle={{
          paddingVertical: 11,
        }}
      />

      <Modal
        animationType="fade"
        onRequestClose={() => setPreviousUnread(undefined)}
        transparent
        visible={!!previousUnread}
      >
        <Pressable
          onPress={() => setPreviousUnread(undefined)}
          style={{
            alignItems: 'center',
            backgroundColor: '#00000052',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <Pressable
            style={{
              width: '90%',
              backgroundColor: '#fff',
              borderRadius: 4,
              padding: 16,
              gap: 12,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
              }}
            >
              Marquer les volumes et chapitres précédents ?
            </Text>

            <Text>
              Voulez-vous marquer les volumes et chapitres précédents comme lus ?
            </Text>

            <View style={{ alignSelf: 'flex-end', flexDirection: 'row', gap: 16 }}>
              <Text
                onPress={() => {
                  setUpdating((prev) => ({
                    ...prev,
                    ...Object.fromEntries(previousUnread!.map((value) => [value.id, true])),
                  }));

                  Promise.all(previousUnread!.map(async (value) => {
                    if (value instanceof Volume) {
                      let volume = value;

                      const volumeEntry = new VolumeEntry({
                        user: new User({ id: user!.id }),
                        volume: volume,
                      });

                      volume = await volumeEntry.save()
                        .then((entry) => volume.copy({ 'volume-entry': entry }))
                        .catch((err) => {
                          console.error(err);
                          return volume;
                        });;

                      onMangaChange(manga.copy({
                        volumes: manga.volumes?.map((v) => v.id === volume.id ? volume : v),
                      }));
                    } else {
                      let chapter = value;

                      const chapterEntry = new ChapterEntry({
                        user: new User({ id: user!.id }),
                        chapter: chapter,
                      });

                      chapter = await chapterEntry.save()
                        .then((entry) => chapter.copy({ 'chapter-entry': entry }))
                        .catch((err) => {
                          console.error(err);
                          return chapter;
                        });

                      const volume = manga.volumes!.find((volume) => volume.chapters!.some((c) => c.id === chapter.id));
                      if (volume) {
                        onMangaChange(manga.copy({
                          volumes: manga.volumes?.map((v) => v.id === volume.id
                            ? volume.copy({
                              chapters: volume.chapters?.map((c) => c.id === chapter.id ? chapter : c)
                            })
                            : v,
                          ),
                        }));
                      } else {
                        onMangaChange(manga.copy({
                          chapters: manga.chapters?.map((c) => c.id === chapter.id ? chapter : c),
                        }));
                      }
                    }

                    setUpdating((prev) => ({ ...prev, [value.id]: false }));
                  }))
                    .catch((err) => console.error(err));

                  setPreviousUnread(undefined);
                }}
                style={{
                  fontWeight: 'bold',
                  padding: 10,
                }}
              >
                Oui
              </Text>

              <Text
                onPress={() => setPreviousUnread(undefined)}
                style={{
                  padding: 10,
                }}
              >
                Non
              </Text>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

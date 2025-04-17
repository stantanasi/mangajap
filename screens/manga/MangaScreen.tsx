import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, SectionList, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from '../../components/atoms/AutoHeightImage';
import TabBar from '../../components/atoms/TabBar';
import ChapterCard from '../../components/molecules/ChapterCard';
import VolumeCard from '../../components/molecules/VolumeCard';
import { AuthContext } from '../../contexts/AuthContext';
import { Chapter, ChapterEntry, Manga, MangaEntry, User, Volume, VolumeEntry } from '../../models';

const AboutTab = ({ manga, style }: {
  manga: Manga;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <ScrollView
      contentContainerStyle={{
        paddingVertical: 16,
      }}
      style={style}
    >
      <AutoHeightImage
        source={{ uri: manga.poster ?? undefined }}
        style={styles.poster}
      />

      <Text style={styles.title}>
        {manga.title}
      </Text>

      <View style={styles.genres}>
        {manga.genres?.map((genre) => (
          <Text
            key={genre.id}
            style={styles.genre}
          >
            {genre.name}
          </Text>
        ))}
      </View>

      <View style={styles.themes}>
        {manga.themes?.map((theme) => (
          <Text
            key={theme.id}
            style={styles.theme}
          >
            {theme.name}
          </Text>
        ))}
      </View>

      <Text style={styles.overview}>
        {manga.overview}
      </Text>
    </ScrollView>
  );
};

const VolumesTab = ({ manga, onMangaChange, style }: {
  manga: Manga;
  onMangaChange: (manga: Manga) => void;
  style?: StyleProp<ViewStyle>;
}) => {
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
    <View style={style}>
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
};


type Props = StaticScreenProps<{
  id: string;
}>;

export default function MangaScreen({ route }: Props) {
  const navigation = useNavigation();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [manga, setManga] = useState<Manga>();
  const [selectedTab, setSelectedTab] = useState<'about' | 'volumes'>('about');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      const manga = await Manga.findById(route.params.id)
        .include([
          'genres',
          'themes',
          `volumes${isAuthenticated ? '.volume-entry' : ''}`,
          `volumes.chapters${isAuthenticated ? '.chapter-entry' : ''}`,
          `chapters${isAuthenticated ? '.chapter-entry' : ''}`,
          ...(isAuthenticated ? ['manga-entry'] : []),
        ]);

      setManga(manga);
    };

    const unsubscribe = navigation.addListener('focus', () => {
      prepare()
        .catch((err) => console.error(err));
    });

    return unsubscribe;
  }, [route.params]);

  if (!manga) {
    return (
      <SafeAreaView style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator
          animating
          color="#000"
          size="large"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TabBar
        selected={selectedTab}
        tabs={[
          { key: 'about', title: 'À propos' },
          { key: 'volumes', title: 'Tomes' },
        ]}
        onTabChange={(key) => setSelectedTab(key)}
      />

      <AboutTab
        manga={manga}
        style={{
          display: selectedTab === 'about' ? 'flex' : 'none',
          flex: 1,
        }}
      />

      <VolumesTab
        manga={manga}
        onMangaChange={(manga) => setManga(manga)}
        style={{
          display: selectedTab === 'volumes' ? 'flex' : 'none',
          flex: 1,
        }}
      />

      {user && !manga['manga-entry']?.isAdd ? (
        <Pressable
          onPress={() => {
            setIsUpdating(true);

            const updateMangaEntry = async () => {
              if (manga['manga-entry']) {
                const mangaEntry = manga['manga-entry'].copy({
                  isAdd: true,
                });
                await mangaEntry.save();

                setManga((prev) => prev?.copy({
                  'manga-entry': mangaEntry,
                }));
              } else {
                const mangaEntry = new MangaEntry({
                  isAdd: true,

                  user: new User({ id: user.id }),
                  manga: manga,
                });
                await mangaEntry.save();

                setManga((prev) => prev?.copy({
                  'manga-entry': mangaEntry,
                }));
              }
            };

            updateMangaEntry()
              .catch((err) => console.error(err))
              .finally(() => setIsUpdating(false));
          }}
          style={{
            alignItems: 'center',
            backgroundColor: '#4281f5',
            flexDirection: 'row',
            gap: 10,
            justifyContent: 'center',
            padding: 16,
          }}
        >
          {!isUpdating ? (
            <MaterialIcons
              name="add"
              color="#fff"
              size={24}
            />
          ) : (
            <ActivityIndicator
              animating
              color="#fff"
              size={24}
            />
          )}

          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            Ajouter le manga
          </Text>
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  poster: {
    width: '80%',
    alignSelf: 'center',
  },
  title: {
    textAlign: 'center',
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  genre: {},
  themes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  theme: {},
  overview: {},
});

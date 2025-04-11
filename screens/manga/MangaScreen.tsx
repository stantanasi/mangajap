import { StaticScreenProps } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from '../../components/atoms/AutoHeightImage';
import ChapterCard from '../../components/molecules/ChapterCard';
import VolumeCard from '../../components/molecules/VolumeCard';
import { AuthContext } from '../../contexts/AuthContext';
import { Manga } from '../../models';

const Header = ({ manga }: { manga: Manga }) => {
  return (
    <View style={styles.header}>
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
    </View>
  );
};


type Props = StaticScreenProps<{
  id: string;
}>;

export default function MangaScreen({ route }: Props) {
  const { isAuthenticated } = useContext(AuthContext);
  const [manga, setManga] = useState<Manga>();
  const [expandedVolumes, setExpandedVolumes] = useState<{ [volumeId: string]: boolean }>({});
  const [updating, setUpdating] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    const prepare = async () => {
      const manga = await Manga.findById(route.params.id)
        .include([
          'genres',
          'themes',
          `volumes${isAuthenticated ? '.volume-entry' : ''}`,
          `volumes.chapters${isAuthenticated ? '.chapter-entry' : ''}`,
          `chapters${isAuthenticated ? '.chapter-entry' : ''}`,
        ]);

      setManga(manga);
    };

    prepare()
      .catch((err) => console.error(err));
  }, []);

  if (!manga) {
    return (
      <SafeAreaView
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
        }}
      >
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
              setManga((prev) => prev?.copy({
                volumes: prev.volumes?.map((v) => v.id === volume.id ? volume : v),
              }));
            }}
            updating={updating[volume.id]}
            onUpdatingChange={(value) => setUpdating((prev) => ({ ...prev, [volume.id]: value }))}
            onPress={() => setExpandedVolumes((prev) => ({ ...prev, [volume.id]: !prev[volume.id] }))}
            expanded={expandedVolumes[volume.id]}
            style={{
              marginHorizontal: 16,
            }}
          />
        )}
        renderSectionFooter={() => <View style={{ height: 10 }} />}
        renderItem={({ item, section: { volume } }) => (
          <ChapterCard
            chapter={item}
            onChapterChange={(chapter) => {
              if (volume) {
                setManga((prev) => prev?.copy({
                  volumes: prev.volumes?.map((v) => v.id === volume.id
                    ? volume.copy({
                      chapters: volume.chapters?.map((c) => c.id === chapter.id ? chapter : c)
                    })
                    : v,
                  ),
                }));
              } else {
                setManga((prev) => prev?.copy({
                  chapters: prev.chapters?.map((c) => c.id === chapter.id ? chapter : c),
                }));
              }
            }}
            updating={updating[item.id] || (volume ? updating[volume.id] : false)}
            onUpdatingChange={(value) => setUpdating((prev) => ({ ...prev, [item.id]: value }))}
            style={{
              marginHorizontal: 16,
            }}
          />
        )}
        ListHeaderComponent={Header({
          manga: manga,
        })}
        SectionSeparatorComponent={() => <View style={{ height: 10 }} />}
        ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {
    marginBottom: 16,
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

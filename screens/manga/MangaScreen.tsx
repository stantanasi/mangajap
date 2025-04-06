import { StaticScreenProps } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from '../../components/atoms/AutoHeightImage';
import ChapterCard from '../../components/molecules/ChapterCard';
import VolumeCard from '../../components/molecules/VolumeCard';
import { AuthContext } from '../../contexts/AuthContext';
import { Manga, Volume } from '../../models';

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

  useEffect(() => {
    Manga.findById(route.params.id)
      .include([
        'genres',
        'themes',
        `volumes.chapters${isAuthenticated ? '.chapter-entry' : ''}`,
        `chapters${isAuthenticated ? '.chapter-entry' : ''}`,
      ])
      .then((manga) => setManga(manga));
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
      <FlatList
        data={[
          ...manga.volumes!,
          ...manga.chapters!.filter((chapter) => !manga.volumes!.some((v) => v.chapters!.some((c) => c.id === chapter.id))),
        ]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          item instanceof Volume ? (
            <VolumeCard
              volume={item}
            />
          ) : (
            <ChapterCard
              chapter={item}
            />
          )
        )}
        ListHeaderComponent={Header({
          manga: manga,
        })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {},
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

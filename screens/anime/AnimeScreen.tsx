import { StaticScreenProps } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from '../../components/atoms/AutoHeightImage';
import EpisodeCard from '../../components/molecules/EpisodeCard';
import SeasonCard from '../../components/molecules/SeasonCard';
import { AuthContext } from '../../contexts/AuthContext';
import { Anime } from '../../models';

const Header = ({ anime }: { anime: Anime }) => {
  return (
    <View style={styles.header}>
      <AutoHeightImage
        source={{ uri: anime.poster ?? undefined }}
        style={styles.poster}
      />

      <Text style={styles.title}>
        {anime.title}
      </Text>

      <View style={styles.genres}>
        {anime.genres?.map((genre) => (
          <Text
            key={genre.id}
            style={styles.genre}
          >
            {genre.name}
          </Text>
        ))}
      </View>

      <View style={styles.themes}>
        {anime.themes?.map((theme) => (
          <Text
            key={theme.id}
            style={styles.theme}
          >
            {theme.name}
          </Text>
        ))}
      </View>

      <Text style={styles.overview}>
        {anime.overview}
      </Text>
    </View>
  );
};


type Props = StaticScreenProps<{
  id: string;
}>;

export default function AnimeScreen({ route }: Props) {
  const { isAuthenticated } = useContext(AuthContext);
  const [anime, setAnime] = useState<Anime>();
  const [expandedSeasons, setExpandedSeasons] = useState<{ [seasonId: string]: boolean }>({});
  const [updating, setUpdating] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    const prepare = async () => {
      const anime = await Anime.findById(route.params.id)
        .include([
          'genres',
          'themes',
          `seasons.episodes${isAuthenticated ? '.episode-entry' : ''}`,
        ]);

      anime.seasons = [
        ...anime.seasons!.filter((s) => s.number !== 0),
        ...anime.seasons!.filter((s) => s.number === 0),
      ];

      setAnime(anime);
    };

    prepare()
      .catch((err) => console.error(err));
  }, []);

  if (!anime) {
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
        sections={anime.seasons!.map((season) => ({
          season: season,
          data: expandedSeasons[season.id] ? season.episodes! : [],
        }))}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { season } }) => (
          <SeasonCard
            season={season}
            onSeasonChange={(season) => {
              setAnime((prev) => prev?.copy({
                seasons: prev.seasons?.map((s) => s.id === season.id ? season : s),
              }));
            }}
            updating={updating[season.id]}
            onUpdatingChange={(value) => setUpdating((prev) => ({
              ...prev,
              [season.id]: value,
              ...season.episodes?.reduce((acc, episode) => {
                acc[episode.id] = value;
                return acc;
              }, {} as typeof updating),
            }))}
            onPress={() => setExpandedSeasons((prev) => ({ ...prev, [season.id]: !prev[season.id] }))}
            expanded={expandedSeasons[season.id]}
            style={{
              marginHorizontal: 16,
            }}
          />
        )}
        renderSectionFooter={() => <View style={{ height: 10 }} />}
        renderItem={({ item, section: { season } }) => (
          <EpisodeCard
            episode={item}
            onEpisodeChange={(episode) => {
              setAnime((prev) => prev?.copy({
                seasons: prev.seasons?.map((s) => s.id === season.id
                  ? season.copy({
                    episodes: season.episodes?.map((e) => e.id === episode.id ? episode : e),
                  })
                  : s),
              }));
            }}
            updating={updating[item.id]}
            onUpdatingChange={(value) => setUpdating((prev) => ({ ...prev, [item.id]: value }))}
            style={{
              marginHorizontal: 16,
            }}
          />
        )}
        ListHeaderComponent={Header({
          anime: anime,
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

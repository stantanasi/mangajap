import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { FlatList, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import AutoHeightImage from '../../../components/atoms/AutoHeightImage';
import { AuthContext } from '../../../contexts/AuthContext';
import { Anime, Manga } from '../../../models';
import AnimeCard from '../../../components/molecules/AnimeCard';
import MangaCard from '../../../components/molecules/MangaCard';

type Props = {
  manga: Manga;
  style?: StyleProp<ViewStyle>;
}

export default function AboutTab({ manga, style }: Props) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingVertical: 16,
      }}
      style={[styles.container, style]}
    >
      {user && user.isAdmin ? (
        <MaterialIcons
          name="edit"
          color="#000"
          size={24}
          onPress={() => navigation.navigate('MangaUpdate', { id: manga.id })}
          style={{
            alignSelf: 'flex-end',
            marginRight: 16,
          }}
        />
      ) : null}

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


      <Text style={styles.sectionTitle}>
        Franchise
      </Text>

      <FlatList
        horizontal
        data={manga.franchises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (item.destination instanceof Anime) {
            return (
              <AnimeCard
                anime={item.destination}
                onPress={() => navigation.navigate('Anime', { id: item.id })}
                showCheckbox={false}
              />
            );
          } else if (item.destination instanceof Manga) {
            return (
              <MangaCard
                manga={item.destination}
                onPress={() => navigation.navigate('Manga', { id: item.id })}
                showCheckbox={false}
              />
            );
          }
          return null;
        }}
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        ListHeaderComponent={() => <View style={{ width: 16 }} />}
        ListFooterComponent={() => <View style={{ width: 16 }} />}
        style={{
          marginTop: 12,
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 20,
  },
});

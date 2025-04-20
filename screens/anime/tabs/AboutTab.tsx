import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { FlatList, Pressable, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import AutoHeightImage from '../../../components/atoms/AutoHeightImage';
import AnimeCard from '../../../components/molecules/AnimeCard';
import MangaCard from '../../../components/molecules/MangaCard';
import PeopleCard from '../../../components/molecules/PeopleCard';
import { AuthContext } from '../../../contexts/AuthContext';
import { Anime, Manga } from '../../../models';

type Props = {
  anime: Anime;
  style?: StyleProp<ViewStyle>;
}

export default function AboutTab({ anime, style }: Props) {
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
          onPress={() => navigation.navigate('AnimeUpdate', { id: anime.id })}
          style={{
            alignSelf: 'flex-end',
            marginRight: 16,
          }}
        />
      ) : null}

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


      <Text style={styles.sectionTitle}>
        Staff
      </Text>

      <FlatList
        horizontal
        data={anime.staff}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PeopleCard
            people={item.people!}
            onPress={() => navigation.navigate('People', { id: item.people!.id })}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        ListHeaderComponent={() => <View style={{ width: 16 }} />}
        ListFooterComponent={() => <View style={{ width: 16 }} />}
        style={{
          marginTop: 12,
        }}
      />


      <Text style={styles.sectionTitle}>
        Franchise
      </Text>

      <FlatList
        horizontal
        data={anime.franchises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (item.destination instanceof Anime) {
            return (
              <View>
                <AnimeCard
                  anime={item.destination}
                  onPress={() => navigation.navigate('Anime', { id: item.id })}
                  showCheckbox={false}
                />
                {user && user.isAdmin ? (
                  <MaterialIcons
                    name="edit"
                    color="#fff"
                    size={24}
                    onPress={() => navigation.navigate('FranchiseUpdate', { franchiseId: item.id })}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      margin: 2,
                    }}
                  />
                ) : null}
              </View>
            );
          } else if (item.destination instanceof Manga) {
            return (
              <View>
                <MangaCard
                  manga={item.destination}
                  onPress={() => navigation.navigate('Manga', { id: item.id })}
                  showCheckbox={false}
                />
                {user && user.isAdmin ? (
                  <MaterialIcons
                    name="edit"
                    color="#fff"
                    size={24}
                    onPress={() => navigation.navigate('FranchiseUpdate', { franchiseId: item.id })}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      margin: 2,
                    }}
                  />
                ) : null}
              </View>
            );
          }
          return null;
        }}
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        ListHeaderComponent={() => <View style={{ width: 16 }} />}
        ListFooterComponent={() => (
          <Pressable
            onPress={() => navigation.navigate('FranchiseCreate', { animeId: anime.id })}
            style={{
              width: 130,
              aspectRatio: 2 / 3,
              backgroundColor: '#ccc',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: anime.franchises!.length > 0 ? 10 : 0,
              marginRight: 16,
            }}
          >
            <MaterialIcons
              name="add"
              color="#000"
              size={24}
            />
          </Pressable>
        )}
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

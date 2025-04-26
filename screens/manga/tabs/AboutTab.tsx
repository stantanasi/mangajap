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
      <AutoHeightImage
        source={{ uri: manga.poster ?? undefined }}
        style={styles.poster}
      />

      <Text style={styles.title}>
        {manga.title}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 14,
          justifyContent: 'center',
          marginHorizontal: 16,
          marginTop: 4,
        }}
      >
        <View style={{ alignItems: 'center', flexDirection: 'row', gap: 2 }}>
          <MaterialIcons
            name="star"
            color="#666"
            size={14}
            style={{ alignSelf: 'center' }}
          />
          <Text style={{ color: '#666' }}>
            {manga.averageRating?.toFixed(1) ?? 'N/A'}
          </Text>
        </View>

        <Text style={{ color: '#666' }}>
          {(() => {
            const startYear = manga.startDate.getFullYear();
            const endYear = manga.endDate?.getFullYear();

            return endYear && startYear !== endYear
              ? `${startYear} - ${endYear}`
              : `${startYear}`;
          })()}
        </Text>

        <Text style={{ color: '#666' }}>
          {(() => {
            const mangaTypeLabels: Record<typeof manga.mangaType, string> = {
              bd: 'BD',
              comics: 'Comics',
              josei: 'Josei',
              kodomo: 'Kodomo',
              seijin: 'Seijin',
              seinen: 'Seinen',
              shojo: 'Shōjo',
              shonen: 'Shōnen',
              doujin: 'Doujin',
              novel: 'Novel',
              oneshot: 'One shot',
              webtoon: 'Webtoon',
            };

            return mangaTypeLabels[manga.mangaType];
          })()}
        </Text>
      </View>

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

      <Text style={styles.overview}>
        {manga.overview}
      </Text>

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


      <Text style={styles.sectionTitle}>
        Staff
      </Text>

      <FlatList
        horizontal
        data={manga.staff}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <PeopleCard
              people={item.people!}
              onPress={() => navigation.navigate('People', { id: item.people!.id })}
            />
            {user && user.isAdmin ? (
              <MaterialIcons
                name="edit"
                color="#fff"
                size={24}
                onPress={() => navigation.navigate('StaffUpdate', { staffId: item.id })}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  margin: 24,
                }}
              />
            ) : null}
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        ListHeaderComponent={() => <View style={{ width: 16 }} />}
        ListFooterComponent={() => (
          <Pressable
            onPress={() => navigation.navigate('MangaStaffCreate', { mangaId: manga.id })}
            style={{
              width: 130,
              alignItems: 'center',
              aspectRatio: 1 / 1,
              backgroundColor: '#ccc',
              borderRadius: 360,
              justifyContent: 'center',
              marginLeft: manga.staff!.length > 0 ? 10 : 0,
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


      <Text style={styles.sectionTitle}>
        De la même franchise
      </Text>

      <FlatList
        horizontal
        data={manga.franchises}
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
            onPress={() => navigation.navigate('MangaFranchiseCreate', { mangaId: manga.id })}
            style={{
              width: 130,
              aspectRatio: 2 / 3,
              backgroundColor: '#ccc',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: manga.franchises!.length > 0 ? 10 : 0,
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
    width: 225,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 8,
  },
  genre: {
    color: '#888',
  },
  overview: {
    marginTop: 14,
    marginHorizontal: 16,
  },
  themes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 8,
  },
  theme: {
    borderColor: '#ccc',
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 20,
  },
});

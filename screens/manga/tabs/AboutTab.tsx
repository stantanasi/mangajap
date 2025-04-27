import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import AutoHeightImage from '../../../components/atoms/AutoHeightImage';
import AnimeCard from '../../../components/molecules/AnimeCard';
import MangaCard from '../../../components/molecules/MangaCard';
import PeopleCard from '../../../components/molecules/PeopleCard';
import { AuthContext } from '../../../contexts/AuthContext';
import { Anime, Manga } from '../../../models';
import { MangaType } from '../../../models/manga.model';

type Props = {
  manga: Manga;
  style?: StyleProp<ViewStyle>;
}

export default function AboutTab({ manga, style }: Props) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [staffEditable, setStaffEditable] = useState(false);
  const [franchisesEditable, setFranchisesEditable] = useState(false);

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
          {MangaType[manga.mangaType]}
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


      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginHorizontal: 16,
          marginTop: 20,
        }}>
        <Text
          style={[styles.sectionTitle, {
            flex: 1,
            margin: 0,
          }]}
        >
          Staff
        </Text>

        {user && user.isAdmin ? (
          <MaterialIcons
            name={!staffEditable ? 'edit' : 'edit-off'}
            color="#000"
            size={24}
            onPress={() => setStaffEditable((prev) => !prev)}
          />
        ) : null}
      </View>

      <FlatList
        horizontal
        data={manga.staff}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PeopleCard
            people={item.people!}
            staff={item}
            editable={staffEditable}
            onPress={() => {
              if (!staffEditable) {
                navigation.navigate('People', { id: item.people!.id })
              } else {
                navigation.navigate('StaffUpdate', { staffId: item.id })
              }
            }}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        ListHeaderComponent={() => <View style={{ width: 16 }} />}
        ListFooterComponent={() => user && user.isAdmin ? (
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
        ) : null}
        style={{
          marginTop: 12,
        }}
      />


      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginHorizontal: 16,
          marginTop: 20,
        }}>
        <Text
          style={[styles.sectionTitle, {
            flex: 1,
            margin: 0,
          }]}
        >
          De la même franchise
        </Text>

        {user && user.isAdmin ? (
          <MaterialIcons
            name={!franchisesEditable ? 'edit' : 'edit-off'}
            color="#000"
            size={24}
            onPress={() => setFranchisesEditable((prev) => !prev)}
          />
        ) : null}
      </View>

      <FlatList
        horizontal
        data={manga.franchises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => item.destination instanceof Anime ? (
          <AnimeCard
            anime={item.destination}
            franchise={item}
            editable={franchisesEditable}
            onPress={() => {
              if (!franchisesEditable) {
                navigation.navigate('Anime', { id: item.destination!.id });
              } else {
                navigation.navigate('FranchiseUpdate', { franchiseId: item.id });
              }
            }}
            showCheckbox={false}
          />
        ) : item.destination instanceof Manga ? (
          <MangaCard
            manga={item.destination}
            franchise={item}
            editable={franchisesEditable}
            onPress={() => {
              if (!franchisesEditable) {
                navigation.dispatch(StackActions.push('Manga', { id: item.destination!.id }));
              } else {
                navigation.navigate('FranchiseUpdate', { franchiseId: item.id });
              }
            }}
            showCheckbox={false}
          />
        ) : null}
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        ListHeaderComponent={() => <View style={{ width: 16 }} />}
        ListFooterComponent={() => user && user.isAdmin ? (
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
        ) : null}
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

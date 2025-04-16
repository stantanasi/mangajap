import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimeSearchCard from '../../components/molecules/AnimeSearchCard';
import MangaSearchCard from '../../components/molecules/MangaSearchCard';
import { Anime, People } from '../../models';

const Header = ({ people }: { people: People }) => {
  return (
    <View style={styles.header}>
      <Image
        source={{ uri: people.portrait ?? undefined }}
        style={styles.image}
      />

      <Text style={styles.name}>
        {people.name}
      </Text>
    </View>
  );
};


type Props = StaticScreenProps<{
  id: string;
}>;

export default function PeopleScreen({ route }: Props) {
  const navigation = useNavigation();
  const [people, setPeople] = useState<People>();

  useEffect(() => {
    const prepare = async () => {
      const people = await People.findById(route.params.id)
        .include([
          'staff.anime',
          'staff.manga',
        ]);

      setPeople(people);
    };

    const unsubscribe = navigation.addListener('focus', () => {
      prepare()
        .catch((err) => console.error(err));
    });

    return unsubscribe;
  }, [route.params]);

  if (!people) {
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
      <FlatList
        data={people.staff!.map((staff) => {
          if (staff.anime) {
            return staff.anime;
          } else if (staff.manga) {
            return staff.manga;
          }
          return null;
        }).filter((media) => !!media)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          item instanceof Anime ? (
            <AnimeSearchCard
              anime={item}
              onPress={() => navigation.navigate('Anime', { id: item.id })}
              style={{
                marginHorizontal: 10,
              }}
            />
          ) : (
            <MangaSearchCard
              manga={item}
              onPress={() => navigation.navigate('Manga', { id: item.id })}
              style={{
                marginHorizontal: 10,
              }}
            />
          )
        )}
        ListHeaderComponent={Header({
          people: people,
        })}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    margin: 16,
  },
  image: {
    width: 180,
    alignSelf: 'center',
    aspectRatio: 1 / 1,
    backgroundColor: '#ccc',
    borderRadius: 360,
  },
  name: {
    color: '#000',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
});

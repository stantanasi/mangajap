import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RefreshControl from '../../components/atoms/RefreshControl';
import AnimeCard from '../../components/molecules/AnimeCard';
import MangaCard from '../../components/molecules/MangaCard';
import { Anime } from '../../models';
import Header from './components/Header';
import { usePeople } from './hooks/usePeople';

type Props = StaticScreenProps<{
  id: string;
}>;

export default function PeopleScreen({ route }: Props) {
  const navigation = useNavigation();
  const { isLoading, people } = usePeople(route.params);

  useEffect(() => {
    if (!people) return;

    navigation.setOptions({
      title: `${people.name} - Personnalité | MangaJap`,
    });
  }, [people]);

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
        data={people.staff?.map((staff) => {
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
            <AnimeCard
              isLoading={isLoading}
              anime={item}
              onPress={() => navigation.navigate('Anime', { id: item.id })}
              variant="horizontal"
              showCheckbox={false}
              style={{
                marginHorizontal: 16,
              }}
            />
          ) : (
            <MangaCard
              isLoading={isLoading}
              manga={item}
              onPress={() => navigation.navigate('Manga', { id: item.id })}
              variant="horizontal"
              showCheckbox={false}
              style={{
                marginHorizontal: 16,
              }}
            />
          )
        )}
        ListHeaderComponent={() => (
          <Header
            isLoading={isLoading}
            people={people}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />

      <RefreshControl refreshing={isLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

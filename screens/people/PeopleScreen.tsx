import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RefreshControl from '../../components/atoms/RefreshControl';
import AnimeCard from '../../components/molecules/AnimeCard';
import MangaCard from '../../components/molecules/MangaCard';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import Tabs from '../../components/organisms/Tabs';
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
      <LoadingScreen style={styles.container} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Container
        header={() => (
          <Header
            isLoading={isLoading}
            people={people}
          />
        )}
      >
        <Tabs.Tab name="Anime">
          <FlatList
            data={people['anime-staff']?.map((staff) => {
              if (staff.anime) {
                return staff.anime;
              }
              return null;
            }).filter((anime) => !!anime)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
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
            )}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            ListFooterComponent={() => <View style={{ height: 16 }} />}
          />
        </Tabs.Tab>

        <Tabs.Tab name="Manga">
          <FlatList
            data={people['manga-staff']?.map((staff) => {
              if (staff.manga) {
                return staff.manga;
              }
              return null;
            }).filter((manga) => !!manga)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
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
            )}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            ListFooterComponent={() => <View style={{ height: 16 }} />}
          />
        </Tabs.Tab>
      </Tabs.Container>

      <RefreshControl refreshing={isLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

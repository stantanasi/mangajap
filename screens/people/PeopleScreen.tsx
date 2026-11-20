import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RefreshControl from '../../components/atoms/RefreshControl';
import AnimeCard from '../../components/molecules/AnimeCard';
import MangaCard from '../../components/molecules/MangaCard';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import Tabs from '../../components/organisms/Tabs';
import { useAppContext } from '../../contexts/AppContext';
import { useAuthContext } from '../../contexts/AuthContext';
import Header from './components/Header';
import { usePeople } from './hooks/usePeople';

type Props = {
  peopleId: string;
};

export default function PeopleScreen(props: Props) {
  const { isOffline } = useAppContext();
  const { user } = useAuthContext();
  const { isLoading, people } = usePeople(props);

  if (!people) {
    return (
      <LoadingScreen style={styles.container} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Container
        title={people.name}
        menuItems={!isOffline && !isLoading && user ? [
          {
            icon: 'edit',
            onPress: () => router.navigate({
              pathname: '/people/[peopleId]/edit',
              params: { peopleId: people.id },
            }),
          },
        ] : []}
        CollapsibleComponent={() => (
          <Header
            people={people}
          />
        )}
      >
        <Tabs.Tab name="Anime">
          <Tabs.FlatList
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
                onPress={() => router.navigate({
                  pathname: '/anime/[animeId]',
                  params: { animeId: item.id },
                })}
                variant="horizontal"
                showCheckbox={false}
                style={{
                  marginHorizontal: 16,
                }}
              />
            )}
            ListHeaderComponent={() => <View style={{ height: 16 }} />}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            ListFooterComponent={() => <View style={{ height: 16 }} />}
          />
        </Tabs.Tab>

        <Tabs.Tab name="Manga">
          <Tabs.FlatList
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
                onPress={() => router.navigate({
                  pathname: '/manga/[mangaId]',
                  params: { mangaId: item.id },
                })}
                variant="horizontal"
                showCheckbox={false}
                style={{
                  marginHorizontal: 16,
                }}
              />
            )}
            ListHeaderComponent={() => <View style={{ height: 16 }} />}
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

import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { router } from 'expo-router';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RefreshControl from '../../components/atoms/RefreshControl';
import AnimeCard from '../../components/molecules/AnimeCard';
import ExpandableFloatingActionButton from '../../components/molecules/ExpandableFloatingActionButton';
import MangaCard from '../../components/molecules/MangaCard';
import PeopleCard from '../../components/molecules/PeopleCard';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import { useAppContext } from '../../contexts/AppContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { useDiscover } from './hooks/useDiscover';

export default function DiscoverScreen() {
  const { isOffline } = useAppContext();
  const { user } = useAuthContext();
  const { isLoading, peoples, animes, mangas } = useDiscover();

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        onPress={() => router.navigate('/search')}
        style={styles.search}
      >
        <MaterialIcons
          name="search"
          size={24}
          color="#666"
        />

        <Text
          style={{
            flex: 1,
            paddingHorizontal: 0,
            paddingVertical: 8,
          }}
        >
          Rechercher
        </Text>
      </Pressable>

      {!peoples || !animes || !mangas ? (
        <LoadingScreen style={{ flex: 1 }} />
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingVertical: 16,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 6,
              marginHorizontal: 16,
            }}
          >
            Dernières personnalités ajoutées
          </Text>

          <FlatList
            horizontal
            data={peoples}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PeopleCard
                people={item}
                onPress={() => router.navigate({
                  pathname: '/people/[peopleId]',
                  params: { peopleId: item.id },
                })}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            ListHeaderComponent={() => <View style={{ width: 16 }} />}
            ListFooterComponent={() => <View style={{ width: 16 }} />}
          />

          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 6,
              marginHorizontal: 16,
              marginTop: 20,
            }}
          >
            Derniers animes ajoutés
          </Text>

          <FlatList
            horizontal
            data={animes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AnimeCard
                isLoading={isLoading}
                anime={item}
                onPress={() => router.navigate({
                  pathname: '/anime/[animeId]',
                  params: { animeId: item.id },
                })}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            ListHeaderComponent={() => <View style={{ width: 16 }} />}
            ListFooterComponent={() => <View style={{ width: 16 }} />}
          />

          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 6,
              marginHorizontal: 16,
              marginTop: 20,
            }}
          >
            Derniers mangas ajoutés
          </Text>

          <FlatList
            horizontal
            data={mangas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MangaCard
                isLoading={isLoading}
                manga={item}
                onPress={() => router.navigate({
                  pathname: '/manga/[mangaId]',
                  params: { mangaId: item.id },
                })}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            ListHeaderComponent={() => <View style={{ width: 16 }} />}
            ListFooterComponent={() => <View style={{ width: 16 }} />}
          />
        </ScrollView>
      )}

      {!isOffline && !isLoading && user ? (
        <ExpandableFloatingActionButton
          icon="add"
          menuItems={[
            {
              icon: 'tv',
              label: 'Animé',
              onPress: () => router.navigate('/anime/create'),
            },
            {
              icon: 'menu-book',
              label: 'Manga',
              onPress: () => router.navigate('/manga/create'),
            },
            {
              icon: 'person',
              label: 'Personnalité',
              onPress: () => router.navigate('/people/create'),
            },
          ]}
        />
      ) : null}

      <RefreshControl refreshing={isLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 10,
  },
});

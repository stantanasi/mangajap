import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RefreshControl from '../../components/atoms/RefreshControl';
import AnimeCard from '../../components/molecules/AnimeCard';
import ExpandableFloatingActionButton from '../../components/molecules/ExpandableFloatingActionButton';
import MangaCard from '../../components/molecules/MangaCard';
import PeopleCard from '../../components/molecules/PeopleCard';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { useDiscover } from './hooks/useDiscover';

type Props = StaticScreenProps<undefined>;

export default function DiscoverScreen({ route }: Props) {
  const navigation = useNavigation();
  const { isOffline } = useApp();
  const { user } = useAuth();
  const { isLoading, peoples, animes, mangas } = useDiscover(route.params);

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        onPress={() => navigation.navigate('Search')}
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
        <ScrollView>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 6,
              marginHorizontal: 16,
            }}
          >
            Personnalités
          </Text>

          <FlatList
            horizontal
            data={peoples}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PeopleCard
                people={item}
                onPress={() => navigation.navigate('People', { id: item.id })}
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
                onPress={() => navigation.navigate('Anime', { id: item.id })}
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
                onPress={() => navigation.navigate('Manga', { id: item.id })}
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
              onPress: () => navigation.navigate('AnimeCreate'),
            },
            {
              icon: 'menu-book',
              label: 'Manga',
              onPress: () => navigation.navigate('MangaCreate'),
            },
            {
              icon: 'person',
              label: 'Personnalité',
              onPress: () => navigation.navigate('PeopleCreate'),
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
    marginBottom: 16,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 10,
  },
});

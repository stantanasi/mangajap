import { router } from 'expo-router';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RefreshControl from '../../components/atoms/RefreshControl';
import AnimeCard from '../../components/molecules/AnimeCard';
import ExpandableFloatingActionButton from '../../components/molecules/ExpandableFloatingActionButton';
import MangaCard from '../../components/molecules/MangaCard';
import SectionHeader from '../../components/molecules/SectionHeader';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import { useAppContext } from '../../contexts/AppContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { useDiscover } from './hooks/useDiscover';

export default function DiscoverScreen() {
  const { isOffline } = useAppContext();
  const { user } = useAuthContext();
  const { isLoading, animes, mangas } = useDiscover();

  if (!animes || !mangas) {
    return (
      <LoadingScreen style={styles.container} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 16,
        }}
      >
        <SectionHeader
          title="Animes populaires"
          style={{
            marginBottom: 12,
            marginHorizontal: 16,
          }}
        />

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
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => <View style={{ width: 16 }} />}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          ListFooterComponent={() => <View style={{ width: 16 }} />}
          style={{
            marginBottom: 26,
          }}
        />

        <SectionHeader
          title="Mangas populaires"
          style={{
            marginBottom: 12,
            marginHorizontal: 16,
          }}
        />

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
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => <View style={{ width: 16 }} />}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          ListFooterComponent={() => <View style={{ width: 16 }} />}
        />
      </ScrollView>

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

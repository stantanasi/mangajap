import { router } from 'expo-router';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RefreshControl from '../../components/atoms/RefreshControl';
import AnimeCard from '../../components/molecules/AnimeCard';
import MangaCard from '../../components/molecules/MangaCard';
import SectionHeader from '../../components/molecules/SectionHeader';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import { useHome } from './hooks/useHome';

export default function HomeScreen() {
  const { isLoading, animes, mangas, latestAnimes, latestMangas } = useHome();

  if (!latestAnimes || !latestMangas) {
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
        {animes && (<>
          <SectionHeader
            title="Continuer à regarder"
            subtitle="Tes épisodes en cours"
            count={animes.length}
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
                showCheckbox={false}
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
        </>)}

        {mangas && (<>
          <SectionHeader
            title="Continuer à lire"
            subtitle="Tes chapitres et tomes en cours"
            count={mangas.length}
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
                showCheckbox={false}
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
            style={{
              marginBottom: 26,
            }}
          />
        </>)}

        <SectionHeader
          title="Derniers animes ajoutés"
          subtitle="Les ajouts récents au catalogue"
          style={{
            marginBottom: 12,
            marginHorizontal: 16,
          }}
        />

        <FlatList
          horizontal
          data={latestAnimes}
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
          title="Derniers mangas ajoutés"
          subtitle="Les ajouts récents au catalogue"
          style={{
            marginBottom: 12,
            marginHorizontal: 16,
          }}
        />

        <FlatList
          horizontal
          data={latestMangas}
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

      <RefreshControl refreshing={isLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RefreshControl from '../../components/atoms/RefreshControl';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import { useAuth } from '../../contexts/AuthContext';
import MangaAgendaCard from './components/MangaAgendaCard';
import { useAgendaManga } from './hooks/useAgendaManga';

type Props = StaticScreenProps<undefined>;

export default function AgendaMangaScreen({ route }: Props) {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { isLoading, mangaLibrary } = useAgendaManga(route.params);

  const mangas = mangaLibrary
    ?.map((entry) => entry.manga?.copy({
      'manga-entry': entry,
    }))
    .filter((manga) => !!manga)
    .filter((manga) => manga.progress < 100);

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text
          style={{
            fontSize: 26,
            fontWeight: 'bold',
            marginBottom: 40,
            marginHorizontal: 16,
          }}
        >
          Vous n'êtes pas connectés
        </Text>

        <Text
          onPress={() => navigation.navigate('Profile')}
          style={{
            borderColor: '#000',
            borderRadius: 360,
            borderWidth: 2,
            color: '#000',
            fontSize: 16,
            fontWeight: 'bold',
            marginHorizontal: 16,
            paddingHorizontal: 25,
            paddingVertical: 15,
          }}
        >
          Se connecter
        </Text>
      </SafeAreaView>
    );
  }

  if (!mangas) {
    return (
      <LoadingScreen style={styles.container} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={mangas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MangaAgendaCard
            manga={item}
            onPress={() => navigation.navigate('Manga', { id: item.id })}
            style={{
              marginHorizontal: 16,
            }}
          />
        )}
        ListHeaderComponent={() => <View style={{ height: 16 }} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={() => <View style={{ height: 16 }} />}
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

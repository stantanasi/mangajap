import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../contexts/AuthContext';
import { MangaEntry, User } from '../../models';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import MangaAgendaCard from './components/MangaAgendaCard';

type Props = StaticScreenProps<undefined>;

export default function AgendaMangaScreen({ }: Props) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const { isLoading, mangaLibrary } = useAgendaManga();

  const mangas = mangaLibrary
    ?.filter((mangaEntry) => {
      const progress = mangaEntry.manga!.chapterCount > 0
        ? (mangaEntry.chaptersRead / mangaEntry.manga!.chapterCount) * 100
        : (mangaEntry.volumesRead / mangaEntry.manga!.volumeCount) * 100;
      return progress < 100;
    })
    .map((entry) => entry.manga!.copy({
      'manga-entry': entry,
    }));

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

  if (isLoading || !mangas) {
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


const useAgendaManga = () => {
  const dispatch = useAppDispatch();
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  const mangaLibrary = useAppSelector(useMemo(() => {
    if (!user) {
      return () => undefined;
    }

    return User.redux.selectors.selectRelation(user.id, 'manga-library', {
      include: {
        manga: true,
      },
      sort: {
        updatedAt: 'desc',
      },
    });
  }, [user]));

  useEffect(() => {
    const prepare = async () => {
      if (!user) return

      const mangaLibrary = await User.findById(user.id).get('manga-library')
        .include({
          manga: true,
        })
        .sort({ updatedAt: 'desc' })
        .limit(500);

      dispatch(MangaEntry.redux.actions.setMany(mangaLibrary));
      dispatch(User.redux.actions.relations['manga-library'].set(user.id, mangaLibrary));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [user]);

  return { isLoading, mangaLibrary };
};

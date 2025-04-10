import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {AuthContext} from '../../contexts/AuthContext';
import { Manga, User } from '../../models';
import MangaAgendaCard from '../../components/molecules/MangaAgendaCard';

type Props = StaticScreenProps<{}>;

export default function AgendaMangaScreen({ }: Props) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [mangas, setMangas] = useState<Manga[]>();

  useEffect(() => {
    const prepare = async () => {
      setMangas(undefined);

      if (user) {
        const mangaLibrary = await User.findById(user.id).get('manga-library')
          .include(['manga'])
          .sort({ updatedAt: 'desc' })
          .limit(500);

        const mangas = mangaLibrary
          .filter((entry) => {
            const progress = (entry.chaptersRead / entry.manga!.chapterCount) * 100;
            return progress < 100;
          })
          .map((entry) => entry.manga!.copy({
            'manga-entry': entry,
          }));

        setMangas(mangas);
      }
    };

    prepare()
      .catch((err) => console.error(err));
  }, []);

  if (!mangas) {
    return (
      <SafeAreaView style={styles.container}>
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
  container: {},
});

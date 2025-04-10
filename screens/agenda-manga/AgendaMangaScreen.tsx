import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MangaAgendaCard from '../../components/molecules/MangaAgendaCard';
import { AuthContext } from '../../contexts/AuthContext';
import { Manga, User } from '../../models';

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
  }, [user]);

  if (!user) {
    return (
      <SafeAreaView
        style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}
      >
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
          onPress={() => navigation.navigate('Profile', {})}
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
  container: {
    flex: 1,
  },
});

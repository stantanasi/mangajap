import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimeAgendaCard from '../../components/molecules/AnimeAgendaCard';
import { AuthContext } from '../../contexts/AuthContext';
import { Anime, User } from '../../models';

type Props = StaticScreenProps<undefined>;

export default function AgendaAnimeScreen({ }: Props) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [animes, setAnimes] = useState<Anime[]>();

  useEffect(() => {
    const prepare = async () => {
      if (!user) return

      const animeLibrary = await User.findById(user.id).get('anime-library')
        .include(['anime'])
        .sort({ updatedAt: 'desc' })
        .limit(500);

      const animes = animeLibrary
        .filter((entry) => {
          const progress = (entry.episodesWatch / entry.anime!.episodeCount) * 100;
          return progress < 100;
        })
        .map((entry) => entry.anime!.copy({
          'anime-entry': entry,
        }));

      setAnimes(animes);
    };

    const unsubscribe = navigation.addListener('focus', () => {
      prepare()
        .catch((err) => console.error(err));
    });

    return unsubscribe;
  }, [user]);

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

  if (!animes) {
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
        data={animes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AnimeAgendaCard
            anime={item}
            onPress={() => navigation.navigate('Anime', { id: item.id })}
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

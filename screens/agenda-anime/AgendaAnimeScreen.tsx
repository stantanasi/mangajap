import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimeAgendaCard from '../../components/molecules/AnimeAgendaCard';
import { AuthContext } from '../../contexts/AuthContext';
import { Anime, User } from '../../models';

type Props = StaticScreenProps<{}>;

export default function AgendaAnimeScreen({ }: Props) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [animes, setAnimes] = useState<Anime[]>();

  useEffect(() => {
    const prepare = async () => {
      setAnimes(undefined);

      if (user) {
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
      }
    };

    prepare()
      .catch((err) => console.error(err));
  }, []);

  if (!animes) {
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
  container: {},
});

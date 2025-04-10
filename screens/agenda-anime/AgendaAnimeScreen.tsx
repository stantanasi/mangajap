import { StaticScreenProps } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../contexts/AuthContext';
import { Anime, User } from '../../models';

type Props = StaticScreenProps<{}>;

export default function AgendaAnimeScreen({ }: Props) {
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

  return (
    <SafeAreaView style={styles.container}>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
});

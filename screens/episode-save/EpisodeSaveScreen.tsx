import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Anime, Episode, Season } from '../../models';
import { IEpisode } from '../../models/episode.model';

type Props = StaticScreenProps<{
  animeId: string;
} | {
  episodeId: string;
}>

export default function EpisodeSaveScreen({ route }: Props) {
  const navigation = useNavigation();
  const [episode, setEpisode] = useState<Episode>();
  const [form, setForm] = useState<Partial<IEpisode>>();
  const [seasons, setSeasons] = useState<Season[]>();

  useEffect(() => {
    const prepare = async () => {
      let episode = new Episode();

      if ('animeId' in route.params) {
        episode = new Episode({
          anime: new Anime({
            id: route.params.animeId,
            seasons: await Anime.findById(route.params.animeId).get('seasons'),
          }),
        });
      } else {
        episode = await Episode.findById(route.params.episodeId)
          .include([
            'anime.seasons',
            'season',
          ]);
      }

      setEpisode(episode);
      setForm(episode.toObject());
      setSeasons(episode.anime?.seasons ?? []);
    };

    const unsubscribe = navigation.addListener('focus', () => {
      prepare()
        .catch((err) => console.error(err));
    });

    return unsubscribe;
  }, [route.params]);

  return (
    <SafeAreaView style={styles.container}>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

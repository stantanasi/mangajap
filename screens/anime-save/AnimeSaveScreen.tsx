import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Anime } from '../../models';
import { IAnime } from '../../models/anime.model';

type Props = StaticScreenProps<{
  id: string;
} | undefined>

export default function AnimeSaveScreen({ route }: Props) {
  const navigation = useNavigation();
  const [anime, setAnime] = useState<Anime>();
  const [form, setForm] = useState<Partial<IAnime>>();

  useEffect(() => {
    const prepare = async () => {
      let anime = new Anime({});

      if (route.params) {
        anime = await Anime.findById(route.params.id);
      }

      setAnime(anime);
      setForm(anime.toObject());
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

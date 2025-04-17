import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Manga } from '../../models';
import { IManga } from '../../models/manga.model';

type Props = StaticScreenProps<{
  id: string
} | undefined>

export default function MangaSaveScreen({ route }: Props) {
  const navigation = useNavigation();
  const [manga, setManga] = useState<Manga>();
  const [form, setForm] = useState<Partial<IManga>>();

  useEffect(() => {
    const prepare = async () => {
      let manga = new Manga({});

      if (route.params) {
        manga = await Manga.findById(route.params.id);
      }

      setManga(manga);
      setForm(manga.toObject());
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

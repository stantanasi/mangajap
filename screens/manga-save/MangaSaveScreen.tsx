import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextInput from '../../components/atoms/TextInput';
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

  if (!manga || !form) {
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
      <TextInput
        label="Titre"
        value={form.title}
        onChangeText={(text) => setForm((prev) => ({
          ...prev!,
          title: text,
        }))}
        style={styles.input}
      />

      <TextInput
        label="Synopsis"
        value={form.overview}
        onChangeText={(text) => setForm((prev) => ({
          ...prev!,
          overview: text,
        }))}
        multiline
        style={styles.input}
      />

      <Text style={styles.sectionTitle}>
        Identifiants externes
      </Text>

      <TextInput
        label="Mangadex"
        value={form.links?.['mangadex']}
        onChangeText={(text) => setForm((prev) => ({
          ...prev!,
          links: {
            ...prev!.links,
            mangadex: text,
          },
        }))}
        style={styles.input}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 20,
  },
});

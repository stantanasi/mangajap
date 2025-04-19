import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateInput from '../../components/atoms/DateInput';
import ImageInput from '../../components/atoms/ImageInput';
import SelectInput from '../../components/atoms/SelectInput';
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
  const [isSaving, setIsSaving] = useState(false);

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
      <ImageInput
        label="Poster"
        value={form.poster}
        onValueChange={(value) => setForm((prev) => ({
          ...prev,
          poster: value,
        }))}
        style={styles.input}
        inputStyle={{
          width: 150,
          minHeight: 150 * 3 / 2,
        }}
      />

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

      <DateInput
        label="Date de début"
        value={form.startDate}
        onValueChange={(text) => setForm((prev) => ({
          ...prev!,
          startDate: text,
        }))}
        style={styles.input}
      />

      <SelectInput
        label="Type de manga"
        values={[
          { label: 'BD', value: 'bd' },
          { label: 'Comics', value: 'comics' },
          { label: 'Josei', value: 'josei' },
          { label: 'Kodomo', value: 'kodomo' },
          { label: 'Seijin', value: 'seijin' },
          { label: 'Seinen', value: 'seinen' },
          { label: 'Shojo', value: 'shojo' },
          { label: 'Shonen', value: 'shonen' },
          { label: 'Doujin', value: 'doujin' },
          { label: 'Novel', value: 'novel' },
          { label: 'Oneshot', value: 'oneshot' },
          { label: 'Webtoon', value: 'webtoon' },
        ]}
        selectedValue={form.mangaType}
        onValueChange={(value) => setForm((prev) => ({
          ...prev,
          mangaType: value,
        }))}
        style={styles.input}
      />

      <SelectInput
        label="Status"
        values={[
          { label: 'En cours', value: 'publishing' },
          { label: 'Terminé', value: 'finished' },
          { label: 'À sortir', value: 'unreleased' },
          { label: 'À venir', value: 'upcoming' },
        ]}
        selectedValue={form.status}
        onValueChange={(value) => setForm((prev) => ({
          ...prev,
          status: value,
        }))}
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

      <Pressable
        disabled={isSaving}
        onPress={() => {
          setIsSaving(true);

          manga.assign(form);

          manga.save()
            .then(() => navigation.goBack())
            .catch((err) => console.error(err))
            .finally(() => setIsSaving(false));
        }}
        style={{
          alignItems: 'center',
          alignSelf: 'flex-start',
          backgroundColor: '#ddd',
          borderRadius: 4,
          flexDirection: 'row',
          gap: 10,
          marginHorizontal: 16,
          marginTop: 24,
          paddingHorizontal: 12,
          paddingVertical: 6,
        }}
      >
        {isSaving && (
          <ActivityIndicator
            animating
            color="#000"
            size={20}
          />
        )}

        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          Enregistrer
        </Text>
      </Pressable>
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

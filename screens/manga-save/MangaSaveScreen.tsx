import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import Checkbox from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateInput from '../../components/atoms/DateInput';
import ImageInput from '../../components/atoms/ImageInput';
import SelectInput from '../../components/atoms/SelectInput';
import TextInput from '../../components/atoms/TextInput';
import { Genre, Manga, Theme } from '../../models';
import { IManga, MangaStatus, MangaType } from '../../models/manga.model';

type Props = StaticScreenProps<{
  id: string
} | undefined>

export default function MangaSaveScreen({ route }: Props) {
  const navigation = useNavigation();
  const [manga, setManga] = useState<Manga>();
  const [form, setForm] = useState<Partial<Object<IManga>>>();
  const [genres, setGenres] = useState<Genre[]>();
  const [themes, setThemes] = useState<Theme[]>();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      let manga = new Manga({
        genres: [],
        themes: [],
      });

      if (route.params) {
        manga = await Manga.findById(route.params.id)
          .include({
            genres: true,
            themes: true,
          });
      }

      const [genres, themes] = await Promise.all([
        Genre.find()
          .sort({
            name: 'asc',
          })
          .limit(1000),
        Theme.find()
          .sort({
            name: 'asc',
          })
          .limit(1000),
      ]);

      setManga(manga);
      setForm(manga.toObject());
      setGenres(genres);
      setThemes(themes);
    };

    const unsubscribe = navigation.addListener('focus', () => {
      prepare()
        .catch((err) => console.error(err));
    });

    return unsubscribe;
  }, [route.params]);

  if (!manga || !form || !genres || !themes) {
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
      <ScrollView>
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
          label="Titre *"
          value={form.title}
          onChangeText={(text) => setForm((prev) => ({
            ...prev,
            title: text,
          }))}
          style={styles.input}
        />

        <TextInput
          label="Synopsis *"
          value={form.overview}
          onChangeText={(text) => setForm((prev) => ({
            ...prev,
            overview: text,
          }))}
          multiline
          style={styles.input}
        />

        <DateInput
          label="Date de début *"
          value={form.startDate}
          onValueChange={(text) => setForm((prev) => ({
            ...prev,
            startDate: text,
          }))}
          style={styles.input}
        />

        <SelectInput
          label="Type de manga *"
          items={MangaType.entries().map(([key, value]) => ({
            value: key,
            label: value,
          }))}
          selectedValue={form.mangaType}
          onValueChange={(value) => setForm((prev) => ({
            ...prev,
            mangaType: value,
          }))}
          style={styles.input}
        />

        <SelectInput
          label="Status *"
          items={MangaStatus.entries().map(([key, value]) => ({
            value: key,
            label: value,
          }))}
          selectedValue={form.status}
          onValueChange={(value) => setForm((prev) => ({
            ...prev,
            status: value,
          }))}
          style={styles.input}
        />

        <Text style={styles.sectionTitle}>
          Genres
        </Text>

        <View
          style={{
            gap: 4,
            marginTop: 16,
          }}
        >
          {genres.map((genre) => {
            const isSelected = form.genres?.some((g) => g.id === genre.id) ?? false;

            return (
              <Pressable
                key={genre.id}
                onPress={() => setForm((prev) => ({
                  ...prev,
                  genres: !isSelected
                    ? [...(prev?.genres ?? [])].concat(genre)
                    : [...(prev?.genres ?? [])].filter((g) => g.id !== genre.id),
                }))}
                style={[styles.input, {
                  borderColor: '#ccc',
                  borderRadius: 4,
                  borderWidth: 1,
                  flexDirection: 'row',
                  gap: 10,
                  marginTop: 0,
                  paddingHorizontal: 6,
                  paddingVertical: 8,
                }]}
              >
                <Checkbox
                  value={isSelected}
                  onValueChange={(value) => setForm((prev) => ({
                    ...prev,
                    genres: value
                      ? [...(prev?.genres ?? [])].concat(genre)
                      : [...(prev?.genres ?? [])].filter((g) => g.id !== genre.id),
                  }))}
                  color="#000"
                />
                <Text>
                  {genre.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>
          Thèmes
        </Text>

        <View
          style={{
            gap: 4,
            marginTop: 16,
          }}
        >
          {themes.map((theme) => {
            const isSelected = form.themes?.some((t) => t.id === theme.id) ?? false;

            return (
              <Pressable
                key={theme.id}
                onPress={() => setForm((prev) => ({
                  ...prev,
                  themes: !isSelected
                    ? [...(prev?.themes ?? [])].concat(theme)
                    : [...(prev?.themes ?? [])].filter((t) => t.id !== theme.id),
                }))}
                style={[styles.input, {
                  borderColor: '#ccc',
                  borderRadius: 4,
                  borderWidth: 1,
                  flexDirection: 'row',
                  gap: 10,
                  marginTop: 0,
                  paddingHorizontal: 6,
                  paddingVertical: 8,
                }]}
              >
                <Checkbox
                  value={isSelected}
                  onValueChange={(value) => setForm((prev) => ({
                    ...prev,
                    themes: value
                      ? [...(prev?.themes ?? [])].concat(theme)
                      : [...(prev?.themes ?? [])].filter((t) => t.id !== theme.id),
                  }))}
                  color="#000"
                />
                <Text>
                  {theme.name}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>
          Identifiants externes
        </Text>

        <TextInput
          label="Mangadex"
          value={form.links?.['mangadex']}
          onChangeText={(text) => setForm((prev) => ({
            ...prev,
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
      </ScrollView>
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

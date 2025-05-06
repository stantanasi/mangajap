import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import Checkbox from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateInput from '../../components/atoms/DateInput';
import ImageInput from '../../components/atoms/ImageInput';
import SelectInput from '../../components/atoms/SelectInput';
import TextInput from '../../components/atoms/TextInput';
import { Anime, Genre, Theme } from '../../models';
import { AnimeStatus, AnimeType, IAnime } from '../../models/anime.model';

type Props = StaticScreenProps<{
  id: string;
} | undefined>

export default function AnimeSaveScreen({ route }: Props) {
  const navigation = useNavigation();
  const [anime, setAnime] = useState<Anime>();
  const [form, setForm] = useState<Partial<Object<IAnime>>>();
  const [genres, setGenres] = useState<Genre[]>();
  const [themes, setThemes] = useState<Theme[]>();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      let anime = new Anime({
        genres: [],
        themes: [],
      });

      if (route.params) {
        anime = await Anime.findById(route.params.id)
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

      setAnime(anime);
      setForm(anime.toObject());
      setGenres(genres);
      setThemes(themes);
    };

    const unsubscribe = navigation.addListener('focus', () => {
      prepare()
        .catch((err) => console.error(err));
    });

    return unsubscribe;
  }, [route.params]);

  if (!anime || !form || !genres || !themes) {
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
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <MaterialIcons
          name="arrow-back"
          size={24}
          color="#000"
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else if (typeof window !== 'undefined') {
              window.history.back();
            }
          }}
          style={{ padding: 16 }}
        />

        <Text
          style={{
            flex: 1,
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {anime.isNew
            ? 'Ajouter un animé'
            : 'Modifier l\'animé'}
        </Text>

        <MaterialIcons
          name="save"
          color="#000"
          size={24}
          onPress={() => {
            setIsSaving(true);

            anime.assign(form);

            anime.save()
              .then(() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else if (typeof window !== 'undefined') {
                  window.history.back();
                }
              })
              .catch((err) => console.error(err))
              .finally(() => setIsSaving(false));
          }}
          style={{ padding: 16 }}
        />
      </View>

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
          label="Type d'animé *"
          items={AnimeType.entries().map(([key, value]) => ({
            value: key,
            label: value,
          }))}
          selectedValue={form.animeType}
          onValueChange={(value) => setForm((prev) => ({
            ...prev,
            animeType: value,
          }))}
          style={styles.input}
        />

        <SelectInput
          label="Status *"
          items={AnimeStatus.entries().map(([key, value]) => ({
            value: key,
            label: value,
          }))}
          selectedValue={form.status}
          onValueChange={(value) => setForm((prev) => ({
            ...prev,
            status: value,
            inProduction: value !== 'finished',
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
          label="TheMovieDB"
          value={form.links?.['themoviedb']}
          onChangeText={(text) => setForm((prev) => ({
            ...prev,
            links: {
              ...prev!.links,
              themoviedb: text,
            },
          }))}
          style={styles.input}
        />
      </ScrollView>

      <Modal
        animationType="fade"
        onRequestClose={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else if (typeof window !== 'undefined') {
            window.history.back();
          }
        }}
        transparent
        visible={isSaving}
      >
        <Pressable
          style={{
            alignItems: 'center',
            backgroundColor: '#00000052',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator
            animating
            color="#fff"
            size="large"
          />
        </Pressable>
      </Modal>
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

import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import Checkbox from 'expo-checkbox';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageInput from '../../components/atoms/ImageInput';
import RefreshControl from '../../components/atoms/RefreshControl';
import SelectInput from '../../components/atoms/SelectInput';
import TextInput from '../../components/atoms/TextInput';
import Header from '../../components/molecules/Header';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import { useApp } from '../../contexts/AppContext';
import { Anime } from '../../models';
import { AnimeStatus, AnimeType, IAnime } from '../../models/anime.model';
import { useAppDispatch } from '../../redux/store';
import notify from '../../utils/notify';
import { useAnimeSave } from './hooks/useAnimeSave';

type Props = StaticScreenProps<{
  id: string;
} | undefined>;

export default function AnimeSaveScreen({ route }: Props) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { isOffline } = useApp();
  const { isLoading, anime, genres, themes } = useAnimeSave(route.params);
  const [form, setForm] = useState<Partial<Object<IAnime>> | undefined>(anime?.toObject());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!anime || anime.isNew) return;

    navigation.setOptions({
      title: `Modifier - ${anime.title} - Anime | MangaJap`,
    });
  }, [anime]);

  useEffect(() => {
    if (anime?.updatedAt?.toISOString() === form?.updatedAt?.toISOString()) return;
    setForm(anime?.toObject());
  }, [anime]);

  if (!anime || !form || !genres || !themes) {
    return (
      <LoadingScreen style={styles.container} />
    );
  }

  const save = async () => {
    anime.assign(form);

    await anime.save();

    Anime.redux.sync(dispatch, anime);

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={anime.isNew
          ? 'Ajouter un animé'
          : 'Modifier l\'animé'}
        menuItems={!isOffline && !isLoading ? [
          {
            icon: 'save',
            onPress: () => {
              setIsSaving(true);

              save()
                .catch((err) => notify.error('anime_save', err))
                .finally(() => setIsSaving(false));
            }
          },
        ] : []}
      />

      <ScrollView
        contentContainerStyle={{
          paddingVertical: 16,
        }}
      >
        <ImageInput
          label="Poster"
          value={form.poster}
          onValueChange={(value) => setForm((prev) => ({
            ...prev,
            poster: value,
          }))}
          style={[styles.input, { marginTop: 0 }]}
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
              ...prev?.links,
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

      <RefreshControl refreshing={isLoading} />
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

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import Checkbox from 'expo-checkbox';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageInput from '../../components/atoms/ImageInput';
import SelectInput from '../../components/atoms/SelectInput';
import TextInput from '../../components/atoms/TextInput';
import { Genre, Manga, Theme } from '../../models';
import { IManga, MangaStatus, MangaType } from '../../models/manga.model';
import { useAppDispatch, useAppSelector } from '../../redux/store';

type Props = StaticScreenProps<{
  id: string
} | undefined>

export default function MangaSaveScreen({ route }: Props) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { isLoading, manga, genres, themes } = useMangaSave(route.params);
  const [form, setForm] = useState<Partial<Object<IManga>>>();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!manga || form) return
    setForm(manga.toObject());
  }, [manga]);

  if (isLoading || !manga || !form || !genres || !themes) {
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

  const save = async () => {
    manga.assign(form);

    await manga.save();

    Manga.redux.sync(dispatch, manga);

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

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
          {manga.isNew
            ? 'Ajouter un manga'
            : 'Modifier le manga'}
        </Text>

        <MaterialIcons
          name="save"
          color="#000"
          size={24}
          onPress={() => {
            setIsSaving(true);

            save()
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


const useMangaSave = (params: Props['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const manga = (() => {
    if (!params) {
      return useMemo(() => new Manga({
        genres: [],
        themes: [],
      }), [params]);
    }

    return useAppSelector((state) => {
      return Manga.redux.selectors.selectById(state, params.id, {
        include: {
          genres: true,
          themes: true,
        },
      });
    });
  })();

  const genres = useAppSelector((state) => {
    return Genre.redux.selectors.select(state);
  });

  const themes = useAppSelector((state) => {
    return Theme.redux.selectors.select(state);
  });

  useEffect(() => {
    const prepare = async () => {
      if (params) {
        const manga = await Manga.findById(params.id)
          .include({
            genres: true,
            themes: true,
          });

        dispatch(Manga.redux.actions.setOne(manga));
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

      dispatch(Genre.redux.actions.setMany(genres));
      dispatch(Theme.redux.actions.setMany(themes));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [params]);

  return { isLoading, manga, genres, themes };
};

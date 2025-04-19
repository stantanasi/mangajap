import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateInput from '../../components/atoms/DateInput';
import ImageInput from '../../components/atoms/ImageInput';
import SelectInput from '../../components/atoms/SelectInput';
import TextInput from '../../components/atoms/TextInput';
import { Anime } from '../../models';
import { IAnime } from '../../models/anime.model';

type Props = StaticScreenProps<{
  id: string;
} | undefined>

export default function AnimeSaveScreen({ route }: Props) {
  const navigation = useNavigation();
  const [anime, setAnime] = useState<Anime>();
  const [form, setForm] = useState<Partial<IAnime>>();
  const [isSaving, setIsSaving] = useState(false);

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

  if (!anime || !form) {
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
          label="Type d'animé *"
          values={[
            { label: 'Série TV', value: 'tv' },
            { label: 'OVA', value: 'ova' },
            { label: 'ONA', value: 'ona' },
            { label: 'Film', value: 'movie' },
            { label: 'Musique', value: 'music' },
            { label: 'Spécial', value: 'special' },
          ]}
          selectedValue={form.animeType}
          onValueChange={(value) => setForm((prev) => ({
            ...prev,
            animeType: value,
          }))}
          style={styles.input}
        />

        <SelectInput
          label="Status *"
          values={[
            { label: 'En cours', value: 'airing' },
            { label: 'Terminé', value: 'finished' },
            { label: 'À sortir', value: 'unreleased' },
            { label: 'À venir', value: 'upcoming' },
          ]}
          selectedValue={form.status}
          onValueChange={(value) => setForm((prev) => ({
            ...prev,
            status: value,
            inProduction: value !== 'finished',
          }))}
          style={styles.input}
        />

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

        <Pressable
          disabled={isSaving}
          onPress={() => {
            setIsSaving(true);

            anime.assign(form);

            anime.save()
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

import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateInput from '../../components/atoms/DateInput';
import ImageInput from '../../components/atoms/ImageInput';
import NumberInput from '../../components/atoms/NumberInput';
import SelectInput from '../../components/atoms/SelectInput';
import TextInput from '../../components/atoms/TextInput';
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
  const [form, setForm] = useState<Partial<Object<IEpisode>>>();
  const [seasons, setSeasons] = useState<Season[]>();
  const [isSaving, setIsSaving] = useState(false);

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
          .include({
            anime: {
              seasons: true,
            },
            season: true,
          });
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

  if (!episode || !form || !seasons) {
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

        <SelectInput
          label="Saison *"
          values={seasons.map((season) => ({
            label: `Saison ${season.number}`,
            value: season.id,
          }))}
          selectedValue={form.season?.id}
          onValueChange={(value) => setForm((prev) => ({
            ...prev,
            season: new Season({ id: value }),
          }))}
          style={styles.input}
        />

        <NumberInput
          label="Numéro *"
          value={form.number}
          onValueChange={(value) => setForm((prev) => ({
            ...prev,
            number: value,
          }))}
          style={styles.input}
        />

        <TextInput
          label="Titre"
          value={form.title}
          onChangeText={(text) => setForm((prev) => ({
            ...prev,
            title: text,
          }))}
          style={styles.input}
        />

        <TextInput
          label="Synopsis"
          value={form.overview}
          onChangeText={(text) => setForm((prev) => ({
            ...prev,
            overview: text,
          }))}
          multiline
          style={styles.input}
        />

        <DateInput
          label="Date de diffusion"
          value={form.airDate ?? undefined}
          onValueChange={(value) => setForm((prev) => ({
            ...prev,
            airDate: value,
          }))}
          style={styles.input}
        />

        <Pressable
          disabled={isSaving}
          onPress={() => {
            setIsSaving(true);

            episode.assign(form);

            episode.save()
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
});

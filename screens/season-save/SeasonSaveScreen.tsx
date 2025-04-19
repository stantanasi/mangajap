import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageInput from '../../components/atoms/ImageInput';
import NumberInput from '../../components/atoms/NumberInput';
import TextInput from '../../components/atoms/TextInput';
import { Anime, Season } from '../../models';
import { ISeason } from '../../models/season.model';

type Props = StaticScreenProps<{
  animeId: string;
} | {
  seasonId: string;
}>

export default function SeasonSaveScreen({ route }: Props) {
  const navigation = useNavigation();
  const [season, setSeason] = useState<Season>();
  const [form, setForm] = useState<Partial<ISeason>>();

  useEffect(() => {
    const prepare = async () => {
      let season = new Season();

      if ('animeId' in route.params) {
        season = new Season({
          anime: new Anime({ id: route.params.animeId }),
        });
      } else {
        season = await Season.findById(route.params.seasonId);
      }

      setSeason(season);
      setForm(season.toObject());
    };

    const unsubscribe = navigation.addListener('focus', () => {
      prepare()
        .catch((err) => console.error(err));
    });

    return unsubscribe;
  }, [route.params]);

  if (!season || !form) {
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

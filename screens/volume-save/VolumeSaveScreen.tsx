import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateInput from '../../components/atoms/DateInput';
import ImageInput from '../../components/atoms/ImageInput';
import NumberInput from '../../components/atoms/NumberInput';
import TextInput from '../../components/atoms/TextInput';
import { Manga, Volume } from '../../models';
import { IVolume } from '../../models/volume.model';

type Props = StaticScreenProps<{
  mangaId: string;
} | {
  volumeId: string;
}>

export default function VolumeSaveScreen({ route }: Props) {
  const navigation = useNavigation();
  const [volume, setVolume] = useState<Volume>();
  const [form, setForm] = useState<Partial<Object<IVolume>>>();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      let volume = new Volume();

      if ('mangaId' in route.params) {
        volume = new Volume({
          manga: new Manga({ id: route.params.mangaId }),
        });
      } else {
        volume = await Volume.findById(route.params.volumeId);
      }

      setVolume(volume);
      setForm(volume.toObject());
    };

    const unsubscribe = navigation.addListener('focus', () => {
      prepare()
        .catch((err) => console.error(err));
    });

    return unsubscribe;
  }, [route.params]);

  if (!volume || !form) {
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
          label="Couverture"
          value={form.cover}
          onValueChange={(value) => setForm((prev) => ({
            ...prev,
            cover: value,
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

        <DateInput
          label="Date de publication"
          value={form.publishedDate ?? undefined}
          onValueChange={(value) => setForm((prev) => ({
            ...prev,
            publishedDate: value,
          }))}
          style={styles.input}
        />

        <Pressable
          disabled={isSaving}
          onPress={() => {
            setIsSaving(true);

            volume.assign(form);

            volume.save()
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

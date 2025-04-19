import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateInput from '../../components/atoms/DateInput';
import ImageInput from '../../components/atoms/ImageInput';
import NumberInput from '../../components/atoms/NumberInput';
import SelectInput from '../../components/atoms/SelectInput';
import TextInput from '../../components/atoms/TextInput';
import { Chapter, Manga, Volume } from '../../models';
import { IChapter } from '../../models/chapter.model';

type Props = StaticScreenProps<{
  mangaId: string;
} | {
  chapterId: string;
}>

export default function ChapterSaveScreen({ route }: Props) {
  const navigation = useNavigation();
  const [chapter, setChapter] = useState<Chapter>();
  const [form, setForm] = useState<Partial<IChapter>>();
  const [volumes, setVolumes] = useState<Volume[]>();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      let chapter = new Chapter();

      if ('mangaId' in route.params) {
        chapter = new Chapter({
          manga: new Manga({
            id: route.params.mangaId,
            volumes: await Manga.findById(route.params.mangaId).get('volumes'),
          }),
        });
      } else {
        chapter = await Chapter.findById(route.params.chapterId)
          .include([
            'manga.volumes',
            'volume',
          ]);
      }

      setChapter(chapter);
      setForm(chapter.toObject());
      setVolumes(chapter.manga?.volumes ?? []);
    };

    const unsubscribe = navigation.addListener('focus', () => {
      prepare()
        .catch((err) => console.error(err));
    });

    return unsubscribe;
  }, [route.params]);

  if (!chapter || !form || !volumes) {
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

        <SelectInput
          label="Tome"
          values={volumes.map((volume) => ({
            label: `Tome ${volume.number}`,
            value: volume.id,
          }))}
          selectedValue={form.volume?.id}
          onValueChange={(value) => setForm((prev) => ({
            ...prev,
            volume: new Volume({ id: value }),
          }))}
          style={styles.input}
        />

        <Pressable
          disabled={isSaving}
          onPress={() => {
            setIsSaving(true);

            chapter.assign(form);

            chapter.save()
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

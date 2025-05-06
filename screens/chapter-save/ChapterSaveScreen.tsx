import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
  const [form, setForm] = useState<Partial<Object<IChapter>>>();
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
          .include({
            manga: {
              volumes: true,
            },
            volume: true,
          });
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
          {chapter.isNew
            ? 'Ajouter un chapitre'
            : 'Modifier le chapitre'}
        </Text>

        <MaterialIcons
          name="save"
          color="#000"
          size={24}
          onPress={() => {
            setIsSaving(true);

            chapter.assign(form);

            chapter.save()
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
          items={volumes.map((volume) => ({
            value: volume.id,
            label: `Tome ${volume.number}`,
          }))}
          selectedValue={form.volume?.id}
          onValueChange={(value) => setForm((prev) => ({
            ...prev,
            volume: new Volume({ id: value }),
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
});

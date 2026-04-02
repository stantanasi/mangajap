import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateInput from '../../components/atoms/DateInput';
import ImageInput from '../../components/atoms/ImageInput';
import NumberInput from '../../components/atoms/NumberInput';
import RefreshControl from '../../components/atoms/RefreshControl';
import SelectInput from '../../components/atoms/SelectInput';
import TextInput from '../../components/atoms/TextInput';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import { useApp } from '../../contexts/AppContext';
import { Chapter, Volume } from '../../models';
import { IChapter } from '../../models/chapter.model';
import { useAppDispatch } from '../../redux/store';
import { useChapterSave } from './hooks/useChapterSave';

type Props = StaticScreenProps<{
  mangaId: string;
} | {
  chapterId: string;
}>;

export default function ChapterSaveScreen({ route }: Props) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { isOffline } = useApp();
  const { isLoading, chapter, volumes } = useChapterSave(route.params);
  const [form, setForm] = useState<Partial<Object<IChapter>> | undefined>(chapter?.toObject());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (chapter?.updatedAt?.toISOString() === form?.updatedAt?.toISOString()) return;
    setForm(chapter?.toObject());
  }, [chapter]);

  if (!chapter || !form) {
    return (
      <LoadingScreen style={styles.container} />
    );
  }

  const save = async () => {
    const prev = chapter.toJSON();

    chapter.assign(form);

    await chapter.save();

    Chapter.redux.sync(dispatch, chapter, prev);

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
          }}
        >
          {chapter.isNew
            ? 'Ajouter un chapitre'
            : 'Modifier le chapitre'}
        </Text>

        {!isOffline && !isLoading ? (
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
        ) : null}
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
          items={volumes?.map((volume) => ({
            value: volume.id,
            label: `Tome ${volume.number}`,
          })) ?? []}
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
});

import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateInput from '../../components/atoms/DateInput';
import ImageInput from '../../components/atoms/ImageInput';
import NumberInput from '../../components/atoms/NumberInput';
import RefreshControl from '../../components/atoms/RefreshControl';
import SelectInput from '../../components/atoms/SelectInput';
import TextInput from '../../components/atoms/TextInput';
import Header from '../../components/molecules/Header';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import { useApp } from '../../contexts/AppContext';
import { Episode, Season } from '../../models';
import { IEpisode } from '../../models/episode.model';
import { useAppDispatch } from '../../redux/store';
import { useEpisodeSave } from './hooks/useEpisodeSave';

type Props = StaticScreenProps<{
  animeId: string;
} | {
  episodeId: string;
}>;

export default function EpisodeSaveScreen({ route }: Props) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { isOffline } = useApp();
  const { isLoading, episode, seasons } = useEpisodeSave(route.params);
  const [form, setForm] = useState<Partial<Object<IEpisode>> | undefined>(episode?.toObject());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (episode?.updatedAt?.toISOString() === form?.updatedAt?.toISOString()) return;
    setForm(episode?.toObject());
  }, [episode]);

  if (!episode || !form) {
    return (
      <LoadingScreen style={styles.container} />
    );
  }

  const save = async () => {
    const prev = episode.toJSON();

    episode.assign(form);

    await episode.save();

    Episode.redux.sync(dispatch, episode, prev);

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={episode.isNew
          ? 'Ajouter un épisode'
          : 'Modifier l\'épisode'}
        menuItems={!isOffline && !isLoading ? [
          {
            icon: 'save',
            onPress: () => {
              setIsSaving(true);

              save()
                .catch((err) => console.error(err))
                .finally(() => setIsSaving(false));
            }
          },
        ] : []}
      />

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
          items={seasons?.map((season) => ({
            value: season.id,
            label: `Saison ${season.number}`,
          })) ?? []}
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

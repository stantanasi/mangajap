import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateInput from '../../components/atoms/DateInput';
import ImageInput from '../../components/atoms/ImageInput';
import NumberInput from '../../components/atoms/NumberInput';
import SelectInput from '../../components/atoms/SelectInput';
import TextInput from '../../components/atoms/TextInput';
import { Anime, Episode, Season } from '../../models';
import { IEpisode } from '../../models/episode.model';
import { useAppDispatch, useAppSelector } from '../../redux/store';

type Props = StaticScreenProps<{
  animeId: string;
} | {
  episodeId: string;
}>

export default function EpisodeSaveScreen({ route }: Props) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { isLoading, episode, seasons } = useEpisodeSave(route.params);
  const [form, setForm] = useState<Partial<Object<IEpisode>>>();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!episode || form) return
    setForm(episode.toObject());
  }, [episode]);

  if (isLoading || !episode || !form || !seasons) {
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
          {episode.isNew
            ? 'Ajouter un épisode'
            : 'Modifier l\'épisode'}
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

        <SelectInput
          label="Saison *"
          items={seasons.map((season) => ({
            value: season.id,
            label: `Saison ${season.number}`,
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


const useEpisodeSave = (params: Props['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const episode = 'animeId' in params
    ? useMemo(() => new Episode({
      anime: new Anime({ id: params.animeId }),
    }), [params])
    : useAppSelector(Episode.redux.selectors.selectById(params.episodeId, {
      include: {
        anime: true,
        season: true,
      },
    }));

  const seasons = useAppSelector(Anime.redux.selectors.selectRelation(episode?.anime?.id ?? '', 'seasons'));

  useEffect(() => {
    const prepare = async () => {
      if ('animeId' in params) {
        const seasons = await Anime.findById(params.animeId).get('seasons');

        dispatch(Season.redux.actions.setMany(seasons));
        dispatch(Anime.redux.actions.relations.seasons.set(params.animeId, seasons));
      } else {
        const episode = await Episode.findById(params.episodeId)
          .include({
            anime: {
              seasons: true,
            },
            season: true,
          });

        dispatch(Episode.redux.actions.setOne(episode));
      }
    };

    setIsLoading(true);
    prepare()
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [params]);

  return { isLoading, episode, seasons };
};

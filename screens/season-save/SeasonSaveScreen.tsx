import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner';
import ImageInput from '../../components/atoms/ImageInput';
import NumberInput from '../../components/atoms/NumberInput';
import RefreshControl from '../../components/atoms/RefreshControl';
import TextInput from '../../components/atoms/TextInput';
import Header from '../../components/molecules/Header';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import { useApp } from '../../contexts/AppContext';
import { Season } from '../../models';
import { ISeason } from '../../models/season.model';
import { useAppDispatch } from '../../redux/store';
import { useSeasonSave } from './hooks/useSeasonSave';

type Props = StaticScreenProps<{
  animeId: string;
} | {
  seasonId: string;
}>;

export default function SeasonSaveScreen({ route }: Props) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { isOffline } = useApp();
  const { isLoading, season } = useSeasonSave(route.params);
  const [form, setForm] = useState<Partial<Object<ISeason>> | undefined>(season?.toObject());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (season?.updatedAt?.toISOString() === form?.updatedAt?.toISOString()) return;
    setForm(season?.toObject());
  }, [season]);

  if (!season || !form) {
    return (
      <LoadingScreen style={styles.container} />
    );
  }

  const save = async () => {
    season.assign(form);

    await season.save();

    Season.redux.sync(dispatch, season);

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={season.isNew
          ? 'Ajouter une saison'
          : 'Modifier la saison'}
        menuItems={!isOffline && !isLoading ? [
          {
            icon: 'save',
            onPress: () => {
              setIsSaving(true);

              save()
                .catch((err) => {
                  console.error(err);
                  toast.error("Échec de l'enregistrement de la saison", {
                    description: err.message || "Une erreur inattendue s'est produite",
                  });
                })
                .finally(() => setIsSaving(false));
            }
          },
        ] : []}
      />

      <ScrollView
        contentContainerStyle={{
          paddingVertical: 16,
        }}
      >
        <ImageInput
          label="Poster"
          value={form.poster}
          onValueChange={(value) => setForm((prev) => ({
            ...prev,
            poster: value,
          }))}
          style={[styles.input, { marginTop: 0 }]}
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

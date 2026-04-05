import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageInput from '../../components/atoms/ImageInput';
import RefreshControl from '../../components/atoms/RefreshControl';
import TextInput from '../../components/atoms/TextInput';
import Header from '../../components/molecules/Header';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import { useApp } from '../../contexts/AppContext';
import { People } from '../../models';
import { IPeople } from '../../models/people.model';
import { useAppDispatch } from '../../redux/store';
import { usePeopleSave } from './hooks/usePeopleSave';

type Props = StaticScreenProps<{
  peopleId: string;
} | undefined>;

export default function PeopleSaveScreen({ route }: Props) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { isOffline } = useApp();
  const { isLoading, people } = usePeopleSave(route.params);
  const [form, setForm] = useState<Partial<Object<IPeople>> | undefined>(people?.toObject());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!people || people.isNew) return;

    navigation.setOptions({
      title: `Modifier - ${people.name} - Personnalité | MangaJap`,
    });
  }, [people]);

  useEffect(() => {
    if (people?.updatedAt?.toISOString() === form?.updatedAt?.toISOString()) return;
    setForm(people?.toObject());
  }, [people]);

  if (!people || !form) {
    return (
      <LoadingScreen style={styles.container} />
    );
  }

  const save = async () => {
    people.assign(form);

    await people.save();

    People.redux.sync(dispatch, people);

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={people.isNew
          ? 'Ajouter une personnalité'
          : 'Modifier la personnalité'}
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

      <ScrollView
        contentContainerStyle={{
          paddingVertical: 16,
        }}
      >
        <ImageInput
          label="Portrait"
          value={form.portrait}
          onValueChange={(value) => setForm((prev) => ({
            ...prev,
            portrait: value,
          }))}
          style={[styles.input, { marginTop: 0 }]}
          inputStyle={{
            width: 150,
            minHeight: 150 * 1 / 1,
          }}
        />

        <TextInput
          label="Nom *"
          value={form.name}
          onChangeText={(text) => setForm((prev) => ({
            ...prev,
            name: text,
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

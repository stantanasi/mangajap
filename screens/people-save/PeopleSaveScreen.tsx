import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageInput from '../../components/atoms/ImageInput';
import RefreshControl from '../../components/atoms/RefreshControl';
import TextInput from '../../components/atoms/TextInput';
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
  const [form, setForm] = useState<Partial<Object<IPeople>>>();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!people || form) return;
    setForm(people.toObject());
  }, [people]);

  if (!people || !form) {
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
          {people.isNew
            ? 'Ajouter une personnalité'
            : 'Modifier la personnalité'}
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
          label="Portrait"
          value={form.portrait}
          onValueChange={(value) => setForm((prev) => ({
            ...prev,
            portrait: value,
          }))}
          style={styles.input}
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

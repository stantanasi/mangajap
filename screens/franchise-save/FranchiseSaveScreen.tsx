import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputLabel from '../../components/atoms/InputLabel';
import RefreshControl from '../../components/atoms/RefreshControl';
import SelectInput from '../../components/atoms/SelectInput';
import Header from '../../components/molecules/Header';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import { useApp } from '../../contexts/AppContext';
import { Franchise } from '../../models';
import { FranchiseRole, IFranchise } from '../../models/franchise.model';
import { useAppDispatch } from '../../redux/store';
import { useFranchiseSave } from './hooks/useFranchiseSave';
import SelectDestinationModal from './modals/SelectDestinationModal';

type Props = StaticScreenProps<{
  animeId: string;
} | {
  mangaId: string;
} | {
  franchiseId: string;
}>;

export default function FranchiseSaveScreen({ route }: Props) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { isOffline } = useApp();
  const { isLoading, franchise } = useFranchiseSave(route.params);
  const [form, setForm] = useState<Partial<Object<IFranchise>> | undefined>(franchise?.toObject());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (franchise?.updatedAt?.toISOString() === form?.updatedAt?.toISOString()) return;
    setForm(franchise?.toObject());
  }, [franchise]);

  if (!franchise || !form) {
    return (
      <LoadingScreen style={styles.container} />
    );
  }

  const save = async () => {
    franchise.assign(form);

    await franchise.save();

    Franchise.redux.sync(dispatch, franchise);

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={franchise.isNew
          ? 'Ajouter une franchise'
          : 'Modifier la franchise'}
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
        <View style={styles.input}>
          <InputLabel>
            Destination *
          </InputLabel>

          <Pressable
            onPress={() => setIsModalVisible(true)}
            style={{
              alignItems: 'center',
              borderColor: '#ccc',
              borderRadius: 4,
              borderWidth: 1,
              flexDirection: 'row',
              gap: 12,
              overflow: 'hidden',
            }}
          >
            {!form.destination ? (
              <View style={{ width: 80, aspectRatio: 2 / 3, backgroundColor: '#ccc' }} />
            ) : (
              <>
                <Image
                  source={{ uri: form.destination.poster ?? undefined }}
                  style={{
                    width: 80,
                    aspectRatio: 2 / 3,
                    backgroundColor: '#ccc',
                  }}
                />

                <Text>
                  {form.destination.title}
                </Text>
              </>
            )}
          </Pressable>

          <SelectDestinationModal
            onSelect={(destination) => {
              setForm((prev) => ({
                ...prev,
                destination: destination,
              }));
              setIsModalVisible(false);
            }}
            onRequestClose={() => setIsModalVisible(false)}
            visible={isModalVisible}
          />
        </View>

        <SelectInput
          label="Role *"
          items={FranchiseRole.entries().map(([key, value]) => ({
            value: key,
            label: value,
          }))}
          selectedValue={form.role}
          onValueChange={(value) => setForm((prev) => ({
            ...prev,
            role: value,
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

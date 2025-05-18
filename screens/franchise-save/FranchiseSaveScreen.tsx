import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputLabel from '../../components/atoms/InputLabel';
import SelectInput from '../../components/atoms/SelectInput';
import { Anime, Franchise, Manga } from '../../models';
import { FranchiseRole, IFranchise } from '../../models/franchise.model';
import SelectDestinationModal from './modals/SelectDestinationModal';

type Props = StaticScreenProps<{
  animeId: string;
} | {
  mangaId: string;
} | {
  franchiseId: string;
}>

export default function FranchiseSaveScreen({ route }: Props) {
  const navigation = useNavigation();
  const [franchise, setFranchise] = useState<Franchise>();
  const [form, setForm] = useState<Partial<Object<IFranchise>>>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      let franchise = new Franchise();

      if ('animeId' in route.params) {
        franchise = new Franchise({
          source: new Anime({ id: route.params.animeId }),
        });
      } else if ('mangaId' in route.params) {
        franchise = new Franchise({
          source: new Manga({ id: route.params.mangaId }),
        });
      } else {
        franchise = await Franchise.findById(route.params.franchiseId)
          .include({ destination: true });
      }

      setFranchise(franchise);
      setForm(franchise.toObject());
    };

    const unsubscribe = navigation.addListener('focus', () => {
      prepare()
        .catch((err) => console.error(err));
    });

    return unsubscribe;
  }, [route.params]);

  if (!franchise || !form) {
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
          {franchise.isNew
            ? 'Ajouter une franchise'
            : 'Modifier la franchise'}
        </Text>

        <MaterialIcons
          name="save"
          color="#000"
          size={24}
          onPress={() => {
            setIsSaving(true);

            franchise.assign(form);

            franchise.save()
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

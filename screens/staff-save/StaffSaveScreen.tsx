import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputLabel from '../../components/atoms/InputLabel';
import SelectInput from '../../components/atoms/SelectInput';
import { Anime, Manga, Staff } from '../../models';
import { IStaff, StaffRole } from '../../models/staff.model';
import SelectPeopleModal from './modals/SelectPeopleModal';

type Props = StaticScreenProps<{
  animeId: string;
} | {
  mangaId: string;
} | {
  staffId: string;
}>

export default function StaffSaveScreen({ route }: Props) {
  const navigation = useNavigation();
  const [staff, setStaff] = useState<Staff>();
  const [form, setForm] = useState<Partial<Object<IStaff>>>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      let staff = new Staff();

      if ('animeId' in route.params) {
        staff = new Staff({
          anime: new Anime({ id: route.params.animeId }),
        });
      } else if ('mangaId' in route.params) {
        staff = new Staff({
          manga: new Manga({ id: route.params.mangaId }),
        });
      } else {
        staff = await Staff.findById(route.params.staffId)
          .include({ people: true });
      }

      setStaff(staff);
      setForm(staff.toObject());
    };

    const unsubscribe = navigation.addListener('focus', () => {
      prepare()
        .catch((err) => console.error(err));
    });

    return unsubscribe;
  }, [route.params]);

  if (!staff || !form) {
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
          {staff.isNew
            ? 'Ajouter un staff'
            : 'Modifier le staff'}
        </Text>

        <MaterialIcons
          name="save"
          color="#000"
          size={24}
          onPress={() => {
            setIsSaving(true);

            staff.assign(form);

            staff.save()
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
            Personnalité *
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
            {!form.people ? (
              <View style={{ width: 100, aspectRatio: 1 / 1, backgroundColor: '#ccc' }} />
            ) : (
              <>
                <Image
                  source={{ uri: form.people.portrait ?? undefined }}
                  style={{
                    width: 100,
                    aspectRatio: 1 / 1,
                    backgroundColor: '#ccc',
                  }}
                />

                <Text>
                  {form.people.name}
                </Text>
              </>
            )}
          </Pressable>

          <SelectPeopleModal
            onSelect={(people) => {
              setForm((prev) => ({
                ...prev,
                people: people,
              }));
              setIsModalVisible(false);
            }}
            onRequestClose={() => setIsModalVisible(false)}
            visible={isModalVisible}
          />
        </View>

        <SelectInput
          label="Role *"
          items={StaffRole.entries().map(([key, value]) => ({
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

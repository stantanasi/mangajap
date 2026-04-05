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
import { Staff } from '../../models';
import { IStaff, StaffRole } from '../../models/staff.model';
import { useAppDispatch } from '../../redux/store';
import { useStaffSave } from './hooks/useStaffSave';
import SelectPeopleModal from './modals/SelectPeopleModal';

type Props = StaticScreenProps<{
  animeId: string;
} | {
  mangaId: string;
} | {
  staffId: string;
}>;

export default function StaffSaveScreen({ route }: Props) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { isOffline } = useApp();
  const { isLoading, staff } = useStaffSave(route.params);
  const [form, setForm] = useState<Partial<Object<IStaff>> | undefined>(staff?.toObject());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (staff?.updatedAt?.toISOString() === form?.updatedAt?.toISOString()) return;
    setForm(staff?.toObject());
  }, [staff]);

  if (!staff || !form) {
    return (
      <LoadingScreen style={styles.container} />
    );
  }

  const save = async () => {
    const prev = staff.toJSON();

    staff.assign(form);

    await staff.save();

    Staff.redux.sync(dispatch, staff, prev);

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={staff.isNew
          ? 'Ajouter un staff'
          : 'Modifier le staff'}
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

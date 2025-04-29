import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputLabel from '../../components/atoms/InputLabel';
import SearchBar from '../../components/atoms/SearchBar';
import SelectInput from '../../components/atoms/SelectInput';
import PeopleCard from '../../components/molecules/PeopleCard';
import { Anime, Manga, People, Staff } from '../../models';
import { IStaff, StaffRole } from '../../models/staff.model';

const SelectDestinationModal = ({ onSelect, onRequestClose, visible }: {
  onSelect: (people: People) => void;
  onRequestClose: () => void;
  visible: boolean;
}) => {
  const [peoples, setPeoples] = useState<People[]>();

  useEffect(() => {
    setPeoples(undefined);
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onRequestClose}
      transparent
      visible={visible}
    >
      <Pressable
        onPress={onRequestClose}
        style={{
          alignItems: 'center',
          backgroundColor: '#00000052',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <Pressable
          style={{
            width: '90%',
            height: '90%',
            backgroundColor: '#fff',
            borderRadius: 4,
            gap: 12,
          }}
        >
          <SearchBar
            onChangeText={() => {
              setPeoples(undefined);
            }}
            onSearch={(query) => {
              setPeoples(undefined);

              People.find({ query: query })
                .then((peoples) => setPeoples(peoples))
                .catch((err) => console.error(err));
            }}
            delay={500}
            style={{
              backgroundColor: undefined,
              borderColor: '#ccc',
              borderRadius: 4,
              borderWidth: 1,
              marginHorizontal: 16,
              marginTop: 16,
            }}
          />

          {!peoples ? (
            <ActivityIndicator
              animating
              color="#000"
              size="large"
            />
          ) : (
            <FlatList
              data={peoples}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <PeopleCard
                  people={item}
                  onPress={() => onSelect(item)}
                  variant="horizontal"
                  style={{
                    marginHorizontal: 16,
                  }}
                />
              )}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              keyboardShouldPersistTaps="always"
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};


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

          <SelectDestinationModal
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

        <Pressable
          disabled={isSaving}
          onPress={() => {
            setIsSaving(true);

            staff.assign(form);

            staff.save()
              .then(() => navigation.goBack())
              .catch((err) => console.error(err))
              .finally(() => setIsSaving(false));
          }}
          style={{
            alignItems: 'center',
            alignSelf: 'flex-start',
            backgroundColor: '#ddd',
            borderRadius: 4,
            flexDirection: 'row',
            gap: 10,
            marginHorizontal: 16,
            marginTop: 24,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          {isSaving && (
            <ActivityIndicator
              animating
              color="#000"
              size={20}
            />
          )}

          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            Enregistrer
          </Text>
        </Pressable>
      </ScrollView>
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

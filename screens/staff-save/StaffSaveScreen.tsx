import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputLabel from '../../components/atoms/InputLabel';
import SearchBar from '../../components/atoms/SearchBar';
import SelectInput from '../../components/atoms/SelectInput';
import PeopleCard from '../../components/molecules/PeopleCard';
import { Anime, Manga, People, Staff } from '../../models';
import { IStaff, StaffRole } from '../../models/staff.model';
import { useAppDispatch, useAppSelector } from '../../redux/store';

const SelectDestinationModal = ({ onSelect, onRequestClose, visible }: {
  onSelect: (people: People) => void;
  onRequestClose: () => void;
  visible: boolean;
}) => {
  const dispatch = useAppDispatch();
  const [peopleIds, setPeopleIds] = useState<string[]>();

  const peoples = useAppSelector(People.redux.selectors.selectByIds(peopleIds ?? []));

  useEffect(() => {
    setPeopleIds(undefined);
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
              setPeopleIds(undefined);
            }}
            onSearch={(query) => {
              setPeopleIds(undefined);

              People.find({ query: query })
                .then((peoples) => {
                  dispatch(People.redux.actions.setMany(peoples));
                  setPeopleIds(peoples.map((people) => people.id));
                })
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

          {!peopleIds ? (
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
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { isLoading, staff } = useStaffSave(route.params);
  const [form, setForm] = useState<Partial<Object<IStaff>>>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(staff?.toObject());
  }, [staff]);

  if (isLoading || !staff || !form) {
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
    const prevPeopleId = staff.people?.id;

    staff.assign(form);

    const newPeople = staff.people;
    const newPeopleId = newPeople?.id;

    await staff.save();

    dispatch(Staff.redux.actions.saveOne(staff));
    if (newPeople)
      dispatch(Staff.redux.actions.relations.people.set(staff.id, newPeople));
    if ('animeId' in route.params) {
      dispatch(Anime.redux.actions.relations.staff.add(route.params.animeId, staff));
    } else if ('mangaId' in route.params) {
      dispatch(Manga.redux.actions.relations.staff.add(route.params.mangaId, staff));
    }
    if (!prevPeopleId && newPeopleId) {
      dispatch(People.redux.actions.relations.staff.add(newPeopleId, staff));
    } else if (prevPeopleId !== newPeopleId) {
      if (prevPeopleId)
        dispatch(People.redux.actions.relations.staff.remove(prevPeopleId, staff));
      if (newPeopleId)
        dispatch(People.redux.actions.relations.staff.add(newPeopleId, staff));
    }

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

            save()
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


const useStaffSave = (params: Props['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const staff = useAppSelector(useMemo(() => {
    if ('animeId' in params) {
      return () => new Staff({
        anime: new Anime({ id: params.animeId }),
      });
    } else if ('mangaId' in params) {
      return () => new Staff({
        manga: new Manga({ id: params.mangaId }),
      });
    }

    return Staff.redux.selectors.selectById(params.staffId, {
      include: {
        people: true,
      },
    });
  }, [params]));

  useEffect(() => {
    const prepare = async () => {
      if (!('staffId' in params)) return

      const staff = await Staff.findById(params.staffId)
        .include({ people: true });

      dispatch(Staff.redux.actions.setOne(staff));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [params]);

  return { isLoading, staff };
};

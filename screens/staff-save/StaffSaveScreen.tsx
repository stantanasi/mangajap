import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SelectInput from '../../components/atoms/SelectInput';
import { Anime, Manga, Staff } from '../../models';
import { IStaff } from '../../models/staff.model';

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
  const [form, setForm] = useState<Partial<IStaff>>();

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
        staff = await Staff.findById(route.params.staffId);
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
        <SelectInput
          label="Role *"
          values={[
            { label: 'Auteur', value: 'author' },
            { label: 'Illustrateur', value: 'illustrator' },
            { label: 'Scénario et dessin', value: 'story_and_art' },
            { label: 'Licencié', value: 'licensor' },
            { label: 'Producteur', value: 'producer' },
            { label: 'Studio', value: 'studio' },
            { label: 'Créateur original', value: 'original_creator' },
          ]}
          selectedValue={form.role}
          onValueChange={(value) => setForm((prev) => ({
            ...prev,
            role: value,
          }))}
          style={styles.input}
        />
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

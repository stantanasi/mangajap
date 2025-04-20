import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SelectInput from '../../components/atoms/SelectInput';
import { Anime, Franchise, Manga } from '../../models';
import { IFranchise } from '../../models/franchise.model';

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
  const [form, setForm] = useState<Partial<IFranchise>>();

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
          .include(['destination']);
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
      <ScrollView>
        <SelectInput
          label="Role *"
          values={[
            { label: 'Adaptation', value: 'adaptation' },
            { label: 'Univers alternatif', value: 'alternative_setting' },
            { label: 'Version alternative', value: 'alternative_version' },
            { label: 'Personnage', value: 'character' },
            { label: 'Histoire complète', value: 'full_story' },
            { label: 'Autre', value: 'other' },
            { label: 'Histoire principale', value: 'parent_story' },
            { label: 'Préquelle', value: 'prequel' },
            { label: 'Suite', value: 'sequel' },
            { label: 'Histoire parallèle', value: 'side_story' },
            { label: 'Spin-off', value: 'spinoff' },
            { label: 'Résumé', value: 'summary' },
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

import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

  return (
    <SafeAreaView style={styles.container}>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

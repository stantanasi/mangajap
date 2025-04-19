import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Anime, Season } from '../../models';
import { ISeason } from '../../models/season.model';

type Props = StaticScreenProps<{
  animeId: string;
} | {
  seasonId: string;
}>

export default function SeasonSaveScreen({ route }: Props) {
  const navigation = useNavigation();
  const [season, setSeason] = useState<Season>();
  const [form, setForm] = useState<Partial<ISeason>>();

  useEffect(() => {
    const prepare = async () => {
      let season = new Season();

      if ('animeId' in route.params) {
        season = new Season({
          anime: new Anime({ id: route.params.animeId }),
        });
      } else {
        season = await Season.findById(route.params.seasonId);
      }

      setSeason(season);
      setForm(season.toObject());
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

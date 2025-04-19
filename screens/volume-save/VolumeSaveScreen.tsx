import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Manga, Volume } from '../../models';
import { IVolume } from '../../models/volume.model';

type Props = StaticScreenProps<{
  mangaId: string;
} | {
  volumeId: string;
}>

export default function VolumeSaveScreen({ route }: Props) {
  const navigation = useNavigation();
  const [volume, setVolume] = useState<Volume>();
  const [form, setForm] = useState<Partial<IVolume>>();

  useEffect(() => {
    const prepare = async () => {
      let volume = new Volume();

      if ('mangaId' in route.params) {
        volume = new Volume({
          manga: new Manga({ id: route.params.mangaId }),
        });
      } else {
        volume = await Volume.findById(route.params.volumeId);
      }

      setVolume(volume);
      setForm(volume.toObject());
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

import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { People } from '../../models';
import { IPeople } from '../../models/people.model';

type Props = StaticScreenProps<{
  peopleId: string;
} | undefined>

export default function PeopleSaveScreen({ route }: Props) {
  const navigation = useNavigation();
  const [people, setPeople] = useState<People>();
  const [form, setForm] = useState<Partial<IPeople>>();

  useEffect(() => {
    const prepare = async () => {
      let people = new People();

      if (route.params) {
        people = await People.findById(route.params.peopleId);
      }

      setPeople(people);
      setForm(people.toObject());
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

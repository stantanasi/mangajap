import { StaticScreenProps } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { People } from '../../models';

type Props = StaticScreenProps<{
  id: string;
}>;

export default function PeopleScreen({ route }: Props) {
  const [people, setPeople] = useState<People>();

  useEffect(() => {
    const prepare = async () => {
      setPeople(undefined);

      const people = await People.findById(route.params.id)
        .include([
          'staff.anime',
          'staff.manga',
        ]);

      setPeople(people);
    };

    prepare()
      .catch((err) => console.error(err));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
});

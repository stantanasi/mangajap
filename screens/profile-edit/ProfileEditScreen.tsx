import { StaticScreenProps } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '../../models';
import { IUser } from '../../models/user.model';

type Props = StaticScreenProps<{
  id: string;
}>;

export default function ProfileEditScreen({ route }: Props) {
  const [user, setUser] = useState<User>();
  const [form, setForm] = useState<IUser>(undefined as any);

  useEffect(() => {
    const prepare = async () => {
      const user = await User.findById(route.params.id);

      setUser(user);
      setForm(user.toObject());
    };

    prepare()
      .catch((err) => console.error(err));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {},
});

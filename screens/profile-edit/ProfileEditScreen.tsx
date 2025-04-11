import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '../../models';
import { IUser } from '../../models/user.model';

type Props = StaticScreenProps<{
  id: string;
}>;

export default function ProfileEditScreen({ route }: Props) {
  const navigation = useNavigation();
  const [user, setUser] = useState<User>();
  const [form, setForm] = useState<IUser>(undefined as any);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      const user = await User.findById(route.params.id);

      setUser(user);
      setForm(user.toObject());
    };

    prepare()
      .catch((err) => console.error(err));
  }, []);

  if (!user || !form) {
    return (
      <SafeAreaView style={styles.container}>
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
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <View style={{ flex: 1 }}>
          <MaterialIcons
            name="close"
            size={24}
            color="#000"
            onPress={() => navigation.goBack()}
            style={{ padding: 16 }}
          />
        </View>

        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Modifier le profil
        </Text>

        <View style={{ flex: 1 }}>
          <Text
            onPress={() => {
              setIsUpdating(true);

              user.assign(form);

              if (!user.isModified()) {
                navigation.goBack();
                setIsUpdating(false);
                return
              }

              user.save()
                .then(() => navigation.goBack())
                .catch((err) => console.error(err))
                .finally(() => setIsUpdating(false));
            }}
            style={{
              padding: 16,
              textAlign: 'right',
            }}
          >
            Enregistrer
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Image
            source={{ uri: form.avatar ?? undefined }}
            style={styles.avatar}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Pseudo
          </Text>

          <TextInput
            value={form.pseudo}
            onChangeText={(text) => setForm((prev) => ({ ...prev, pseudo: text }))}
            placeholder="Votre pseudo"
            placeholderTextColor="#666"
            style={styles.input}
          />
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        onRequestClose={() => navigation.goBack()}
        transparent
        visible={isUpdating}
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    width: 100,
    aspectRatio: 1 / 1,
    backgroundColor: '#ccc',
    borderRadius: 360,
  },
  row: {
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingVertical: 16,
  },
  label: {
    width: 100,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    padding: 0,
  },
});

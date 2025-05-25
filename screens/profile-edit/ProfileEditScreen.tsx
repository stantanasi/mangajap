import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import { launchImageLibraryAsync } from 'expo-image-picker';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '../../models';
import { IUser } from '../../models/user.model';
import { useAppDispatch, useAppSelector } from '../../redux/store';

type Props = StaticScreenProps<{
  id: string;
}>;

export default function ProfileEditScreen({ route }: Props) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { isLoading, user } = useProfileEdit(route.params);
  const [form, setForm] = useState<Partial<Object<IUser>>>();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!user || form) return
    setForm(user.toObject());
  }, [user]);

  if (isLoading || !user || !form) {
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
    user.assign(form);

    if (!user.isModified()) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else if (typeof window !== 'undefined') {
        window.history.back();
      }
      setIsUpdating(false);
      return
    }


    await user.save();

    User.redux.sync(dispatch, user);

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
          Modifier le profil
        </Text>

        <MaterialIcons
          name="save"
          color="#000"
          size={24}
          onPress={() => {
            setIsUpdating(true);

            save()
              .catch((err) => console.error(err))
              .finally(() => setIsUpdating(false));
          }}
          style={{ padding: 16 }}
        />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingVertical: 16,
        }}
      >
        <Pressable
          onPress={() => {
            launchImageLibraryAsync({
              mediaTypes: 'images',
              allowsEditing: true,
              aspect: [1, 1],
              base64: true,
              quality: 1,
            })
              .then((result) => {
                if (result.canceled) return

                const base64 = result.assets[0].base64;
                if (!base64) return

                setForm((prev) => ({
                  ...prev,
                  avatar: `data:image/jpg;base64,${base64}`,
                }));
              })
              .catch((err) => console.error(err));
          }}
          style={{
            alignSelf: 'center',
            marginBottom: 16,
            marginHorizontal: 16,
          }}
        >
          <Image
            source={{ uri: form.avatar ?? undefined }}
            style={styles.avatar}
          />

          <MaterialIcons
            name="edit"
            size={18}
            color="#fff"
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: '#000',
              borderRadius: 4,
              padding: 4,
            }}
          />
        </Pressable>

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

        <View style={styles.row}>
          <Text style={styles.label}>
            Nom
          </Text>

          <TextInput
            value={form.name}
            onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
            placeholder="Votre nom"
            placeholderTextColor="#666"
            style={styles.input}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Bio
          </Text>

          <TextInput
            value={form.bio}
            onChangeText={(text) => setForm((prev) => ({ ...prev, bio: text }))}
            placeholder="Votre bio"
            placeholderTextColor="#666"
            multiline
            style={styles.input}
          />
        </View>
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
    alignItems: 'flex-start',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    marginHorizontal: 16,
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


const useProfileEdit = (params: Props['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const user = useAppSelector(User.redux.selectors.selectById(params.id));

  useEffect(() => {
    const prepare = async () => {
      const user = await User.findById(params.id);

      dispatch(User.redux.actions.setOne(user));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [params]);

  return { isLoading, user };
};

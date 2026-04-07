import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import { launchImageLibraryAsync } from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RefreshControl from '../../components/atoms/RefreshControl';
import Header from '../../components/molecules/Header';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import { useApp } from '../../contexts/AppContext';
import { User } from '../../models';
import { IUser } from '../../models/user.model';
import { useAppDispatch } from '../../redux/store';
import notify from '../../utils/notify';
import { useProfileEdit } from './hooks/useProfileEdit';

type Props = StaticScreenProps<{
  id: string;
}>;

export default function ProfileEditScreen({ route }: Props) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { isOffline } = useApp();
  const { isLoading, user } = useProfileEdit(route.params);
  const [form, setForm] = useState<Partial<Object<IUser>> | undefined>(user?.toObject());
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user?.updatedAt?.toISOString() === form?.updatedAt?.toISOString()) return;
    setForm(user?.toObject());
  }, [user]);

  if (!user || !form) {
    return (
      <LoadingScreen style={styles.container} />
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
      return;
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
      <Header
        title="Modifier le profil"
        menuItems={!isOffline && !isLoading ? [
          {
            icon: 'save',
            onPress: () => {
              setIsUpdating(true);

              save()
                .catch((err) => notify.error('profile_edit', err))
                .finally(() => setIsUpdating(false));
            }
          },
        ] : []}
      />

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
                const asset = result.assets?.[0];
                if (result.canceled || !asset?.base64) return;

                const mimeType = asset.mimeType ?? 'image/jpeg';
                const base64 = `data:${mimeType};base64,${asset.base64}`;

                setForm((prev) => ({
                  ...prev,
                  avatar: base64,
                }));
              })
              .catch((err) => notify.error('image_upload', err));
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

      <RefreshControl refreshing={isLoading} />
    </SafeAreaView>
  );
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

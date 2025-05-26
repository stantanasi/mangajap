import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputLabel from '../../components/atoms/InputLabel';
import SelectInput from '../../components/atoms/SelectInput';
import { Anime, Franchise, Manga } from '../../models';
import { FranchiseRole, IFranchise } from '../../models/franchise.model';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import SelectDestinationModal from './modals/SelectDestinationModal';

type Props = StaticScreenProps<{
  animeId: string;
} | {
  mangaId: string;
} | {
  franchiseId: string;
}>

export default function FranchiseSaveScreen({ route }: Props) {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { isLoading, franchise } = useFranchiseSave(route.params);
  const [form, setForm] = useState<Partial<Object<IFranchise>>>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!franchise || form) return
    setForm(franchise.toObject());
  }, [franchise]);

  if (isLoading || !franchise || !form) {
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
    franchise.assign(form);

    await franchise.save();

    Franchise.redux.sync(dispatch, franchise);

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
          {franchise.isNew
            ? 'Ajouter une franchise'
            : 'Modifier la franchise'}
        </Text>

        <MaterialIcons
          name="save"
          color="#000"
          size={24}
          onPress={() => {
            setIsSaving(true);

            save()
              .catch((err) => console.error(err))
              .finally(() => setIsSaving(false));
          }}
          style={{ padding: 16 }}
        />
      </View>

      <ScrollView>
        <View style={styles.input}>
          <InputLabel>
            Destination *
          </InputLabel>

          <Pressable
            onPress={() => setIsModalVisible(true)}
            style={{
              alignItems: 'center',
              borderColor: '#ccc',
              borderRadius: 4,
              borderWidth: 1,
              flexDirection: 'row',
              gap: 12,
              overflow: 'hidden',
            }}
          >
            {!form.destination ? (
              <View style={{ width: 80, aspectRatio: 2 / 3, backgroundColor: '#ccc' }} />
            ) : (
              <>
                <Image
                  source={{ uri: form.destination.poster ?? undefined }}
                  style={{
                    width: 80,
                    aspectRatio: 2 / 3,
                    backgroundColor: '#ccc',
                  }}
                />

                <Text>
                  {form.destination.title}
                </Text>
              </>
            )}
          </Pressable>

          <SelectDestinationModal
            onSelect={(destination) => {
              setForm((prev) => ({
                ...prev,
                destination: destination,
              }));
              setIsModalVisible(false);
            }}
            onRequestClose={() => setIsModalVisible(false)}
            visible={isModalVisible}
          />
        </View>

        <SelectInput
          label="Role *"
          items={FranchiseRole.entries().map(([key, value]) => ({
            value: key,
            label: value,
          }))}
          selectedValue={form.role}
          onValueChange={(value) => setForm((prev) => ({
            ...prev,
            role: value,
          }))}
          style={styles.input}
        />
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
        visible={isSaving}
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


const useFranchiseSave = (params: Props['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const franchise = (() => {
    if ('animeId' in params) {
      return useMemo(() => new Franchise({
        source: new Anime({ id: params.animeId }),
      }), [params]);
    } else if ('mangaId' in params) {
      return useMemo(() => new Franchise({
        source: new Manga({ id: params.mangaId }),
      }), [params]);
    }

    return useAppSelector((state) => {
      return Franchise.redux.selectors.selectById(state, params.franchiseId, {
        include: {
          destination: true,
        },
      });
    });
  })();

  useEffect(() => {
    const prepare = async () => {
      if (!('franchiseId' in params)) return

      const franchise = await Franchise.findById(params.franchiseId)
        .include({ destination: true });

      dispatch(Franchise.redux.actions.setOne(franchise));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [params]);

  return { isLoading, franchise };
};

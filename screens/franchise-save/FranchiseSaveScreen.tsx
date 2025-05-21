import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputLabel from '../../components/atoms/InputLabel';
import SearchBar from '../../components/atoms/SearchBar';
import SelectInput from '../../components/atoms/SelectInput';
import TabBar from '../../components/atoms/TabBar';
import AnimeCard from '../../components/molecules/AnimeCard';
import MangaCard from '../../components/molecules/MangaCard';
import { Anime, Franchise, Manga } from '../../models';
import { FranchiseRole, IFranchise } from '../../models/franchise.model';
import { useAppDispatch, useAppSelector } from '../../redux/store';

const SelectDestinationModal = ({ onSelect, onRequestClose, visible }: {
  onSelect: (destination: Anime | Manga) => void;
  onRequestClose: () => void;
  visible: boolean;
}) => {
  const dispatch = useAppDispatch();
  const [animeIds, setAnimeIds] = useState<string[]>();
  const [mangaIds, setMangaIds] = useState<string[]>();
  const [selectedTab, setSelectedTab] = useState<'anime' | 'manga'>('anime');

  const animes = useAppSelector(Anime.redux.selectors.selectByIds(animeIds ?? []));
  const mangas = useAppSelector(Manga.redux.selectors.selectByIds(mangaIds ?? []));

  useEffect(() => {
    setAnimeIds(undefined);
    setMangaIds(undefined);
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onRequestClose}
      transparent
      visible={visible}
    >
      <Pressable
        onPress={onRequestClose}
        style={{
          alignItems: 'center',
          backgroundColor: '#00000052',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <Pressable
          style={{
            width: '90%',
            height: '90%',
            backgroundColor: '#fff',
            borderRadius: 4,
            gap: 12,
          }}
        >
          <SearchBar
            onChangeText={() => {
              setAnimeIds(undefined);
              setMangaIds(undefined);
            }}
            onSearch={(query) => {
              setAnimeIds(undefined);
              setMangaIds(undefined);

              Promise.all([
                Anime.find({ query: query }),
                Manga.find({ query: query }),
              ])
                .then(([animes, mangas]) => {
                  dispatch(Anime.redux.actions.setMany(animes));
                  dispatch(Manga.redux.actions.setMany(mangas));

                  setAnimeIds(animes.map((anime) => anime.id));
                  setMangaIds(mangas.map((manga) => manga.id));
                })
                .catch((err) => console.error(err));
            }}
            delay={500}
            style={{
              backgroundColor: undefined,
              borderColor: '#ccc',
              borderRadius: 4,
              borderWidth: 1,
              marginHorizontal: 16,
              marginTop: 16,
            }}
          />

          <TabBar
            selected={selectedTab}
            tabs={[
              { key: 'anime', title: 'Animé' },
              { key: 'manga', title: 'Manga' },
            ]}
            onTabChange={(key) => setSelectedTab(key)}
          />

          <View
            style={{
              display: selectedTab === 'anime' ? 'flex' : 'none',
              flex: 1,
            }}
          >
            {!animeIds ? (
              <ActivityIndicator
                animating
                color="#000"
                size="large"
              />
            ) : (
              <FlatList
                data={animes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <AnimeCard
                    anime={item}
                    onPress={() => onSelect(item)}
                    variant="horizontal"
                    showCheckbox={false}
                    style={{
                      marginHorizontal: 16,
                    }}
                  />
                )}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                keyboardShouldPersistTaps="always"
              />
            )}
          </View>

          <View
            style={{
              display: selectedTab === 'manga' ? 'flex' : 'none',
              flex: 1,
            }}
          >
            {!mangaIds ? (
              <ActivityIndicator
                animating
                color="#000"
                size="large"
              />
            ) : (
              <FlatList
                data={mangas}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <MangaCard
                    manga={item}
                    onPress={() => onSelect(item)}
                    variant="horizontal"
                    showCheckbox={false}
                    style={{
                      marginHorizontal: 16,
                    }}
                  />
                )}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                keyboardShouldPersistTaps="always"
              />
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};


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
    setForm(franchise?.toObject());
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

            franchise.assign(form);

            const newDestination = franchise.destination;

            franchise.save()
              .then(() => {
                dispatch(Franchise.redux.actions.setOne(franchise));
                if (newDestination)
                  dispatch(Franchise.redux.actions.relations.destination.set(franchise.id, newDestination));
                if ('animeId' in route.params) {
                  dispatch(Anime.redux.actions.relations.franchises.add(route.params.animeId, franchise));
                } else if ('mangaId' in route.params) {
                  dispatch(Manga.redux.actions.relations.franchises.add(route.params.mangaId, franchise));
                }

                if (navigation.canGoBack()) {
                  navigation.goBack();
                } else if (typeof window !== 'undefined') {
                  window.history.back();
                }
              })
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

  const franchise = useAppSelector(useMemo(() => {
    if ('animeId' in params) {
      return () => new Franchise({
        source: new Anime({ id: params.animeId }),
      });
    } else if ('mangaId' in params) {
      return () => new Franchise({
        source: new Manga({ id: params.mangaId }),
      });
    }

    return Franchise.redux.selectors.selectById(params.franchiseId, {
      include: {
        destination: true,
      },
    });
  }, [params]));

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

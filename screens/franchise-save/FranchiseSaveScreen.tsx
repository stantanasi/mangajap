import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { Object } from '@stantanasi/jsonapi-client';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputLabel from '../../components/atoms/InputLabel';
import SearchBar from '../../components/atoms/SearchBar';
import SelectInput from '../../components/atoms/SelectInput';
import TabBar from '../../components/atoms/TabBar';
import AnimeCard from '../../components/molecules/AnimeCard';
import MangaCard from '../../components/molecules/MangaCard';
import { Anime, Franchise, Manga } from '../../models';
import { IFranchise } from '../../models/franchise.model';

const SelectDestinationModal = ({ onSelect, onRequestClose, visible }: {
  onSelect: (destination: Anime | Manga) => void;
  onRequestClose: () => void;
  visible: boolean;
}) => {
  const [animes, setAnimes] = useState<Anime[]>();
  const [mangas, setMangas] = useState<Manga[]>();
  const [selectedTab, setSelectedTab] = useState<'anime' | 'manga'>('anime');

  useEffect(() => {
    setAnimes(undefined);
    setMangas(undefined);
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
              setAnimes(undefined);
              setMangas(undefined);
            }}
            onSearch={(query) => {
              setAnimes(undefined);
              setMangas(undefined);

              Promise.all([
                Anime.find({ query: query }),
                Manga.find({ query: query }),
              ])
                .then(([animes, mangas]) => {
                  setAnimes(animes);
                  setMangas(mangas);
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
            {!animes ? (
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
            {!mangas ? (
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
  const navigation = useNavigation();
  const [franchise, setFranchise] = useState<Franchise>();
  const [form, setForm] = useState<Partial<Object<IFranchise>>>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      let franchise = new Franchise();

      if ('animeId' in route.params) {
        franchise = new Franchise({
          source: new Anime({ id: route.params.animeId }),
        });
      } else if ('mangaId' in route.params) {
        franchise = new Franchise({
          source: new Manga({ id: route.params.mangaId }),
        });
      } else {
        franchise = await Franchise.findById(route.params.franchiseId)
          .include({ destination: true });
      }

      setFranchise(franchise);
      setForm(franchise.toObject());
    };

    const unsubscribe = navigation.addListener('focus', () => {
      prepare()
        .catch((err) => console.error(err));
    });

    return unsubscribe;
  }, [route.params]);

  if (!franchise || !form) {
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
          items={[
            { label: 'Adaptation', value: 'adaptation' },
            { label: 'Univers alternatif', value: 'alternative_setting' },
            { label: 'Version alternative', value: 'alternative_version' },
            { label: 'Personnage', value: 'character' },
            { label: 'Histoire complète', value: 'full_story' },
            { label: 'Autre', value: 'other' },
            { label: 'Histoire principale', value: 'parent_story' },
            { label: 'Préquelle', value: 'prequel' },
            { label: 'Suite', value: 'sequel' },
            { label: 'Histoire parallèle', value: 'side_story' },
            { label: 'Spin-off', value: 'spinoff' },
            { label: 'Résumé', value: 'summary' },
          ]}
          selectedValue={form.role}
          onValueChange={(value) => setForm((prev) => ({
            ...prev,
            role: value,
          }))}
          style={styles.input}
        />

        <Pressable
          disabled={isSaving}
          onPress={() => {
            setIsSaving(true);

            franchise.assign(form);

            franchise.save()
              .then(() => navigation.goBack())
              .catch((err) => console.error(err))
              .finally(() => setIsSaving(false));
          }}
          style={{
            alignItems: 'center',
            alignSelf: 'flex-start',
            backgroundColor: '#ddd',
            borderRadius: 4,
            flexDirection: 'row',
            gap: 10,
            marginHorizontal: 16,
            marginTop: 24,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          {isSaving && (
            <ActivityIndicator
              animating
              color="#000"
              size={20}
            />
          )}

          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
            }}
          >
            Enregistrer
          </Text>
        </Pressable>
      </ScrollView>
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

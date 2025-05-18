import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, View } from 'react-native';
import SearchBar from '../../../components/atoms/SearchBar';
import TabBar from '../../../components/atoms/TabBar';
import AnimeCard from '../../../components/molecules/AnimeCard';
import MangaCard from '../../../components/molecules/MangaCard';
import { Anime, Manga } from '../../../models';

type Props = {
  onSelect: (destination: Anime | Manga) => void;
  onRequestClose: () => void;
  visible: boolean;
}

export default function SelectDestinationModal({ onSelect, onRequestClose, visible }: Props) {
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

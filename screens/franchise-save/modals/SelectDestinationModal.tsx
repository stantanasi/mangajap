import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import Modal from '../../../components/atoms/Modal';
import SearchBar from '../../../components/atoms/SearchBar';
import TabBar from '../../../components/atoms/TabBar';
import AnimeCard from '../../../components/molecules/AnimeCard';
import MangaCard from '../../../components/molecules/MangaCard';
import { Anime, Manga } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import notify from '../../../utils/notify';

type Props = {
  onSelect: (destination: Anime | Manga) => void;
  onRequestClose: () => void;
  visible: boolean;
};

export default function SelectDestinationModal({ onSelect, onRequestClose, visible }: Props) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [animeIds, setAnimeIds] = useState<string[]>([]);
  const [mangaIds, setMangaIds] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState<'anime' | 'manga'>('anime');

  const animes = useAppSelector((state) => {
    return Anime.redux.selectors.selectByIds(state, animeIds);
  });
  const mangas = useAppSelector((state) => {
    return Manga.redux.selectors.selectByIds(state, mangaIds);
  });

  useEffect(() => {
    setAnimeIds([]);
    setMangaIds([]);
  }, [visible]);

  return (
    <Modal
      onRequestClose={onRequestClose}
      visible={visible}
      style={{ height: '90%' }}
    >
      <SearchBar
        onChangeText={() => {
          setAnimeIds([]);
          setMangaIds([]);
        }}
        onSearch={(query) => {
          setAnimeIds([]);
          setMangaIds([]);

          setIsLoading(true);
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
            .catch((err) => notify.error('search_load', err))
            .finally(() => setIsLoading(false));
        }}
        delay={500}
        style={{
          backgroundColor: undefined,
          borderColor: '#ccc',
          borderRadius: 4,
          borderWidth: 1,
          marginHorizontal: 16,
          marginTop: 16,
          paddingHorizontal: 10,
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
        {isLoading ? (
          <ActivityIndicator
            animating
            color="#000"
            size="large"
            style={{ margin: 16 }}
          />
        ) : (
          <FlatList
            data={animes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AnimeCard
                isLoading={!animes}
                anime={item}
                onPress={() => onSelect(item)}
                variant="horizontal"
                showCheckbox={false}
                style={{
                  marginHorizontal: 16,
                }}
              />
            )}
            ListHeaderComponent={() => <View style={{ height: 16 }} />}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            ListFooterComponent={() => <View style={{ height: 16 }} />}
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
        {isLoading ? (
          <ActivityIndicator
            animating
            color="#000"
            size="large"
            style={{ margin: 16 }}
          />
        ) : (
          <FlatList
            data={mangas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MangaCard
                isLoading={!mangas}
                manga={item}
                onPress={() => onSelect(item)}
                variant="horizontal"
                showCheckbox={false}
                style={{
                  marginHorizontal: 16,
                }}
              />
            )}
            ListHeaderComponent={() => <View style={{ height: 16 }} />}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            ListFooterComponent={() => <View style={{ height: 16 }} />}
            keyboardShouldPersistTaps="always"
          />
        )}
      </View>
    </Modal>
  );
};

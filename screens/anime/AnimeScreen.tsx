import { StaticScreenProps } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../contexts/AuthContext';
import { Anime } from '../../models';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import AddAnimeButton from './components/AddAnimeButton';
import Header from './components/Header';
import AboutTab from './tabs/AboutTab';
import EpisodesTab from './tabs/EpisodesTab';

type Props = StaticScreenProps<{
  id: string;
}>;

export default function AnimeScreen({ route }: Props) {
  const { user } = useContext(AuthContext);
  const { isLoading, anime } = useAnime(route.params);
  const [selectedTab, setSelectedTab] = useState<'about' | 'episodes'>('about');

  if (isLoading || !anime) {
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
      <Header
        anime={anime}
        tabs={[
          { key: 'about', title: 'À propos' },
          { key: 'episodes', title: 'Épisodes' },
        ]}
        selectedTab={selectedTab}
        onTabSelect={(tab) => setSelectedTab(tab)}
      />

      <AboutTab
        anime={anime}
        style={{
          display: selectedTab === 'about' ? 'flex' : 'none',
          flex: 1,
        }}
      />

      <EpisodesTab
        anime={anime}
        style={{
          display: selectedTab === 'episodes' ? 'flex' : 'none',
          flex: 1,
        }}
      />

      {user && !anime['anime-entry']?.isAdd ? (
        <AddAnimeButton
          anime={anime}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


const useAnime = (params: Props['route']['params']) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  const anime = useAppSelector((state) => {
    return Anime.redux.selectors.selectById(state, params.id, {
      include: {
        genres: true,
        themes: true,
        seasons: {
          include: {
            episodes: {
              include: {
                'episode-entry': isAuthenticated,
              },
              sort: {
                number: 'asc',
              },
            },
          },
          sort: {
            number: 'asc',
          },
        },
        staff: {
          include: {
            people: true,
          },
        },
        franchises: {
          include: {
            destination: true,
          },
        },
        'anime-entry': isAuthenticated,
      },
    });
  });

  useEffect(() => {
    const prepare = async () => {
      const anime = await Anime.findById(params.id)
        .include({
          genres: true,
          themes: true,
          seasons: {
            episodes: {
              'episode-entry': isAuthenticated,
            },
          },
          staff: {
            people: true,
          },
          franchises: {
            destination: true,
          },
          'anime-entry': isAuthenticated,
        });

      dispatch(Anime.redux.actions.setOne(anime));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [params]);

  return { isLoading, anime };
};

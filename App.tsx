import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from "expo-linking";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useContext, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthProvider, { AuthContext } from './contexts/AuthContext';
import AgendaAnimeScreen from './screens/agenda-anime/AgendaAnimeScreen';
import AgendaMangaScreen from './screens/agenda-manga/AgendaMangaScreen';
import AnimeSaveScreen from './screens/anime-save/AnimeSaveScreen';
import AnimeScreen from './screens/anime/AnimeScreen';
import ChapterSaveScreen from './screens/chapter-save/ChapterSaveScreen';
import DiscoverScreen from './screens/discover/DiscoverScreen';
import EpisodeSaveScreen from './screens/episode-save/EpisodeSaveScreen';
import FollowsScreen from './screens/follows/FollowsScreen';
import FranchiseSaveScreen from './screens/franchise-save/FranchiseSaveScreen';
import LibraryScreen from './screens/library/LibraryScreen';
import MangaSaveScreen from './screens/manga-save/MangaSaveScreen';
import MangaScreen from './screens/manga/MangaScreen';
import PeopleSaveScreen from './screens/people-save/PeopleSaveScreen';
import PeopleScreen from './screens/people/PeopleScreen';
import ProfileEditScreen from './screens/profile-edit/ProfileEditScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import SearchScreen from './screens/search/SearchScreen';
import SeasonSaveScreen from './screens/season-save/SeasonSaveScreen';
import SettingsScreen from './screens/settings/SettingsScreen';
import StaffSaveScreen from './screens/staff-save/StaffSaveScreen';
import VolumeSaveScreen from './screens/volume-save/VolumeSaveScreen';

const MainTabs = createBottomTabNavigator({
  initialRouteName: 'Discover',
  screenOptions: {
    header: () => null,
    tabBarShowLabel: false,
  },
  screens: {
    AgendaAnime: {
      screen: AgendaAnimeScreen,
      linking: {
        path: 'agenda/anime',
      },
      options: {
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons
            name="tv"
            size={size}
            color={color}
          />
        ),
      },
    },
    AgendaManga: {
      screen: AgendaMangaScreen,
      linking: {
        path: 'agenda/manga',
      },
      options: {
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons
            name="menu-book"
            size={size}
            color={color}
          />
        ),
      },
    },
    Discover: {
      screen: DiscoverScreen,
      linking: {
        path: '',
      },
      options: {
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons
            name="search"
            size={size}
            color={color}
          />
        ),
      },
    },
    Profile: {
      screen: ProfileScreen,
      linking: {
        path: 'profile',
      },
      options: {
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons
            name="person"
            size={size}
            color={color}
          />
        ),
      },
    },
  },
});

const RootStack = createNativeStackNavigator({
  initialRouteName: 'Main',
  screenOptions: {
    header: () => null,
  },
  screens: {
    Main: {
      screen: MainTabs,
    },
    Anime: {
      screen: AnimeScreen,
      linking: {
        path: 'anime/:id',
      },
    },
    AnimeCreate: {
      screen: AnimeSaveScreen,
      linking: {
        path: 'anime/add',
      },
    },
    AnimeUpdate: {
      screen: AnimeSaveScreen,
      linking: {
        path: 'anime/:id/edit',
      },
    },
    SeasonCreate: {
      screen: SeasonSaveScreen,
      linking: {
        path: 'anime/:animeId/season/add',
      },
    },
    SeasonUpdate: {
      screen: SeasonSaveScreen,
      linking: {
        path: 'season/:seasonId/edit',
      },
    },
    EpisodeCreate: {
      screen: EpisodeSaveScreen,
      linking: {
        path: 'anime/:animeId/episode/add',
      },
    },
    EpisodeUpdate: {
      screen: EpisodeSaveScreen,
      linking: {
        path: 'episode/:episodeId/edit',
      },
    },
    Manga: {
      screen: MangaScreen,
      linking: {
        path: 'manga/:id',
      },
    },
    MangaCreate: {
      screen: MangaSaveScreen,
      linking: {
        path: 'manga/add',
      },
    },
    MangaUpdate: {
      screen: MangaSaveScreen,
      linking: {
        path: 'manga/:id/edit',
      },
    },
    VolumeCreate: {
      screen: VolumeSaveScreen,
      linking: {
        path: 'manga/:mangaId/volume/add',
      },
    },
    VolumeUpdate: {
      screen: VolumeSaveScreen,
      linking: {
        path: 'volume/:volumeId/edit',
      },
    },
    ChapterCreate: {
      screen: ChapterSaveScreen,
      linking: {
        path: 'manga/:mangaId/chapter/add',
      },
    },
    ChapterUpdate: {
      screen: ChapterSaveScreen,
      linking: {
        path: 'chapter/:chapterId/edit',
      },
    },
    StaffCreate: {
      screen: StaffSaveScreen,
    },
    StaffUpdate: {
      screen: StaffSaveScreen,
    },
    FranchiseCreate: {
      screen: FranchiseSaveScreen,
    },
    FranchiseUpdate: {
      screen: FranchiseSaveScreen,
    },
    Search: {
      screen: SearchScreen,
      linking: {
        path: 'search',
      },
    },
    Profile: {
      screen: ProfileScreen,
      linking: {
        path: 'profile/:id',
      },
    },
    ProfileEdit: {
      screen: ProfileEditScreen,
      linking: {
        path: 'profile/:id/edit',
      },
    },
    Follows: {
      screen: FollowsScreen,
      linking: {
        path: 'profile/:userId/:type',
      },
    },
    Library: {
      screen: LibraryScreen,
      linking: {
        path: 'profile/:userId/library/:type',
      },
    },
    People: {
      screen: PeopleScreen,
      linking: {
        path: 'people/:id',
      },
    },
    PeopleCreate: {
      screen: PeopleSaveScreen,
      linking: {
        path: 'people/add',
      },
    },
    PeopleUpdate: {
      screen: PeopleSaveScreen,
      linking: {
        path: 'people/:peopleId/edit',
      },
    },
    Settings: {
      screen: SettingsScreen,
      linking: {
        path: 'settings',
      },
    },
  },
});

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}

const Navigation = createStaticNavigation(RootStack);

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { isReady: isAuthReady } = useContext(AuthContext)
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    setIsAppReady(true);
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (isAuthReady && isAppReady) {
      SplashScreen.hide();
    }
  }, [isAuthReady, isAppReady]);

  if (!isAuthReady || !isAppReady) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <Navigation
        linking={{
          prefixes: [Linking.createURL("/")],
        }}
      />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

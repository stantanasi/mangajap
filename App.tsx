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
import NotFoundScreen from './screens/not-found/NotFoundScreen';
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
    tabBarShowLabel: true,
    tabBarStyle: {
      height: 'auto',
    },
  },
  screens: {
    AgendaAnime: {
      screen: AgendaAnimeScreen,
      linking: {
        path: 'mangajap/agenda/anime',
      },
      options: {
        tabBarLabel: 'Animé',
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
        path: 'mangajap/agenda/manga',
      },
      options: {
        tabBarLabel: 'Manga',
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
        path: 'mangajap/',
      },
      options: {
        tabBarLabel: 'Découvrir',
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
        path: 'mangajap/profile',
      },
      options: {
        tabBarLabel: 'Profil',
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
    contentStyle: {
      backgroundColor: '#fafafa',
    },
  },
  screens: {
    Main: {
      screen: MainTabs,
    },
    Anime: {
      screen: AnimeScreen,
      linking: {
        path: 'mangajap/anime/:id',
      },
    },
    AnimeCreate: {
      screen: AnimeSaveScreen,
      linking: {
        path: 'mangajap/anime/add',
      },
    },
    AnimeUpdate: {
      screen: AnimeSaveScreen,
      linking: {
        path: 'mangajap/anime/:id/edit',
      },
    },
    SeasonCreate: {
      screen: SeasonSaveScreen,
      linking: {
        path: 'mangajap/anime/:animeId/season/add',
      },
    },
    SeasonUpdate: {
      screen: SeasonSaveScreen,
      linking: {
        path: 'mangajap/season/:seasonId/edit',
      },
    },
    EpisodeCreate: {
      screen: EpisodeSaveScreen,
      linking: {
        path: 'mangajap/anime/:animeId/episode/add',
      },
    },
    EpisodeUpdate: {
      screen: EpisodeSaveScreen,
      linking: {
        path: 'mangajap/episode/:episodeId/edit',
      },
    },
    AnimeStaffCreate: {
      screen: StaffSaveScreen,
      linking: {
        path: 'mangajap/anime/:animeId/staff/create',
      },
    },
    AnimeFranchiseCreate: {
      screen: FranchiseSaveScreen,
      linking: {
        path: 'mangajap/anime/:animeId/franchise/create',
      },
    },
    Manga: {
      screen: MangaScreen,
      linking: {
        path: 'mangajap/manga/:id',
      },
    },
    MangaCreate: {
      screen: MangaSaveScreen,
      linking: {
        path: 'mangajap/manga/add',
      },
    },
    MangaUpdate: {
      screen: MangaSaveScreen,
      linking: {
        path: 'mangajap/manga/:id/edit',
      },
    },
    VolumeCreate: {
      screen: VolumeSaveScreen,
      linking: {
        path: 'mangajap/manga/:mangaId/volume/add',
      },
    },
    VolumeUpdate: {
      screen: VolumeSaveScreen,
      linking: {
        path: 'mangajap/volume/:volumeId/edit',
      },
    },
    ChapterCreate: {
      screen: ChapterSaveScreen,
      linking: {
        path: 'mangajap/manga/:mangaId/chapter/add',
      },
    },
    ChapterUpdate: {
      screen: ChapterSaveScreen,
      linking: {
        path: 'mangajap/chapter/:chapterId/edit',
      },
    },
    MangaStaffCreate: {
      screen: StaffSaveScreen,
      linking: {
        path: 'mangajap/manga/:mangaId/staff/create',
      },
    },
    StaffUpdate: {
      screen: StaffSaveScreen,
      linking: {
        path: 'mangajap/staff/:staffId/edit',
      },
    },
    MangaFranchiseCreate: {
      screen: FranchiseSaveScreen,
      linking: {
        path: 'mangajap/manga/:mangaId/franchise/create',
      },
    },
    FranchiseUpdate: {
      screen: FranchiseSaveScreen,
      linking: {
        path: 'mangajap/franchise/:franchiseId/edit',
      },
    },
    Search: {
      screen: SearchScreen,
      linking: {
        path: 'mangajap/search',
      },
    },
    Profile: {
      screen: ProfileScreen,
      linking: {
        path: 'mangajap/profile/:id',
      },
    },
    ProfileEdit: {
      screen: ProfileEditScreen,
      linking: {
        path: 'mangajap/profile/:id/edit',
      },
    },
    ProfileFollowers: {
      screen: FollowsScreen,
      linking: {
        path: 'mangajap/profile/:userId/followers',
      },
    },
    ProfileFollowing: {
      screen: FollowsScreen,
      linking: {
        path: 'mangajap/profile/:userId/following',
      },
    },
    ProfileAnimeLibrary: {
      screen: LibraryScreen,
      linking: {
        path: 'mangajap/profile/:userId/anime-library',
      },
    },
    ProfileMangaLibrary: {
      screen: LibraryScreen,
      linking: {
        path: 'mangajap/profile/:userId/manga-library',
      },
    },
    ProfileAnimeFavorites: {
      screen: LibraryScreen,
      linking: {
        path: 'mangajap/profile/:userId/anime-favorites',
      },
    },
    ProfileMangaFavorites: {
      screen: LibraryScreen,
      linking: {
        path: 'mangajap/profile/:userId/manga-favorites',
      },
    },
    People: {
      screen: PeopleScreen,
      linking: {
        path: 'mangajap/people/:id',
      },
    },
    PeopleCreate: {
      screen: PeopleSaveScreen,
      linking: {
        path: 'mangajap/people/add',
      },
    },
    PeopleUpdate: {
      screen: PeopleSaveScreen,
      linking: {
        path: 'mangajap/people/:peopleId/edit',
      },
    },
    Settings: {
      screen: SettingsScreen,
      linking: {
        path: 'mangajap/settings',
      },
    },
    NotFound: {
      screen: NotFoundScreen,
      linking: {
        path: 'mangajap/*',
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

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
    },
    AnimeCreate: {
      screen: AnimeSaveScreen,
    },
    AnimeUpdate: {
      screen: AnimeSaveScreen,
    },
    SeasonCreate: {
      screen: SeasonSaveScreen,
    },
    SeasonUpdate: {
      screen: SeasonSaveScreen,
    },
    EpisodeCreate: {
      screen: EpisodeSaveScreen,
    },
    EpisodeUpdate: {
      screen: EpisodeSaveScreen,
    },
    Manga: {
      screen: MangaScreen,
    },
    MangaCreate: {
      screen: MangaSaveScreen,
    },
    MangaUpdate: {
      screen: MangaSaveScreen,
    },
    VolumeCreate: {
      screen: VolumeSaveScreen,
    },
    VolumeUpdate: {
      screen: VolumeSaveScreen,
    },
    ChapterCreate: {
      screen: ChapterSaveScreen,
    },
    ChapterUpdate: {
      screen: ChapterSaveScreen,
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
    },
    Profile: {
      screen: ProfileScreen,
    },
    ProfileEdit: {
      screen: ProfileEditScreen,
    },
    Follows: {
      screen: FollowsScreen,
    },
    Library: {
      screen: LibraryScreen,
    },
    People: {
      screen: PeopleScreen,
    },
    PeopleCreate: {
      screen: PeopleSaveScreen,
    },
    PeopleUpdate: {
      screen: PeopleSaveScreen,
    },
    Settings: {
      screen: SettingsScreen,
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
      <Navigation />
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

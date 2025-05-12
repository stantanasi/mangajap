import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from "expo-linking";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Image, Platform } from 'react-native';
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
    title: 'MangaJap',
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
    title: 'MangaJap',
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
      if: () => {
        const { user } = useContext(AuthContext);
        return user != null && user.isAdmin;
      },
      screen: AnimeSaveScreen,
      linking: {
        path: 'mangajap/anime/add',
      },
    },
    AnimeUpdate: {
      if: () => {
        const { user } = useContext(AuthContext);
        return user != null && user.isAdmin;
      },
      screen: AnimeSaveScreen,
      linking: {
        path: 'mangajap/anime/:id/edit',
      },
    },
    SeasonCreate: {
      if: () => {
        const { user } = useContext(AuthContext);
        return user != null && user.isAdmin;
      },
      screen: SeasonSaveScreen,
      linking: {
        path: 'mangajap/anime/:animeId/season/add',
      },
    },
    SeasonUpdate: {
      if: () => {
        const { user } = useContext(AuthContext);
        return user != null && user.isAdmin;
      },
      screen: SeasonSaveScreen,
      linking: {
        path: 'mangajap/season/:seasonId/edit',
      },
    },
    EpisodeCreate: {
      if: () => {
        const { user } = useContext(AuthContext);
        return user != null && user.isAdmin;
      },
      screen: EpisodeSaveScreen,
      linking: {
        path: 'mangajap/anime/:animeId/episode/add',
      },
    },
    EpisodeUpdate: {
      if: () => {
        const { user } = useContext(AuthContext);
        return user != null && user.isAdmin;
      },
      screen: EpisodeSaveScreen,
      linking: {
        path: 'mangajap/episode/:episodeId/edit',
      },
    },
    AnimeStaffCreate: {
      if: () => {
        const { user } = useContext(AuthContext);
        return user != null && user.isAdmin;
      },
      screen: StaffSaveScreen,
      linking: {
        path: 'mangajap/anime/:animeId/staff/create',
      },
    },
    AnimeFranchiseCreate: {
      if: () => {
        const { user } = useContext(AuthContext);
        return user != null && user.isAdmin;
      },
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
      if: () => {
        const { user } = useContext(AuthContext);
        return user != null && user.isAdmin;
      },
      screen: MangaSaveScreen,
      linking: {
        path: 'mangajap/manga/add',
      },
    },
    MangaUpdate: {
      if: () => {
        const { user } = useContext(AuthContext);
        return user != null && user.isAdmin;
      },
      screen: MangaSaveScreen,
      linking: {
        path: 'mangajap/manga/:id/edit',
      },
    },
    VolumeCreate: {
      if: () => {
        const { user } = useContext(AuthContext);
        return user != null && user.isAdmin;
      },
      screen: VolumeSaveScreen,
      linking: {
        path: 'mangajap/manga/:mangaId/volume/add',
      },
    },
    VolumeUpdate: {
      if: () => {
        const { user } = useContext(AuthContext);
        return user != null && user.isAdmin;
      },
      screen: VolumeSaveScreen,
      linking: {
        path: 'mangajap/volume/:volumeId/edit',
      },
    },
    ChapterCreate: {
      if: () => {
        const { user } = useContext(AuthContext);
        return user != null && user.isAdmin;
      },
      screen: ChapterSaveScreen,
      linking: {
        path: 'mangajap/manga/:mangaId/chapter/add',
      },
    },
    ChapterUpdate: {
      if: () => {
        const { user } = useContext(AuthContext);
        return user != null && user.isAdmin;
      },
      screen: ChapterSaveScreen,
      linking: {
        path: 'mangajap/chapter/:chapterId/edit',
      },
    },
    MangaStaffCreate: {
      if: () => {
        const { user } = useContext(AuthContext);
        return user != null && user.isAdmin;
      },
      screen: StaffSaveScreen,
      linking: {
        path: 'mangajap/manga/:mangaId/staff/create',
      },
    },
    StaffUpdate: {
      if: () => {
        const { user } = useContext(AuthContext);
        return user != null && user.isAdmin;
      },
      screen: StaffSaveScreen,
      linking: {
        path: 'mangajap/staff/:staffId/edit',
      },
    },
    MangaFranchiseCreate: {
      if: () => {
        const { user } = useContext(AuthContext);
        return user != null && user.isAdmin;
      },
      screen: FranchiseSaveScreen,
      linking: {
        path: 'mangajap/manga/:mangaId/franchise/create',
      },
    },
    FranchiseUpdate: {
      if: () => {
        const { user } = useContext(AuthContext);
        return user != null && user.isAdmin;
      },
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
      if: () => {
        const { isAuthenticated } = useContext(AuthContext);
        return isAuthenticated;
      },
      screen: ProfileEditScreen,
      linking: {
        path: 'mangajap/profile/:id/edit',
      },
    },
    ProfileFollows: {
      screen: FollowsScreen,
      linking: {
        path: 'mangajap/profile/:userId/:type(followers|following)',
      },
    },
    ProfileLibrary: {
      screen: LibraryScreen,
      linking: {
        path: 'mangajap/profile/:userId/:type(anime-library|anime-favorites|manga-library|manga-favorites)',
      },
    },
    People: {
      screen: PeopleScreen,
      linking: {
        path: 'mangajap/people/:id',
      },
    },
    PeopleCreate: {
      if: () => {
        const { user } = useContext(AuthContext);
        return user != null && user.isAdmin;
      },
      screen: PeopleSaveScreen,
      linking: {
        path: 'mangajap/people/add',
      },
    },
    PeopleUpdate: {
      if: () => {
        const { user } = useContext(AuthContext);
        return user != null && user.isAdmin;
      },
      screen: PeopleSaveScreen,
      linking: {
        path: 'mangajap/people/:peopleId/edit',
      },
    },
    Settings: {
      if: () => {
        const { isAuthenticated } = useContext(AuthContext);
        return isAuthenticated;
      },
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
    if (Platform.OS === 'web') {
      return (
        <Image
          source={require('./assets/splash.png')}
          resizeMode="contain"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
          }}
        />
      );
    } else {
      return null;
    }
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

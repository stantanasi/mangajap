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
import AnimeScreen from './screens/anime/AnimeScreen';
import DiscoverScreen from './screens/discover/DiscoverScreen';
import FollowsScreen from './screens/follows/FollowsScreen';
import LibraryScreen from './screens/library/LibraryScreen';
import MangaScreen from './screens/manga/MangaScreen';
import PeopleScreen from './screens/people/PeopleScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import SearchScreen from './screens/search/SearchScreen';

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
    Manga: {
      screen: MangaScreen,
    },
    Search: {
      screen: SearchScreen,
    },
    Profile: {
      screen: ProfileScreen,
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

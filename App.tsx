import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from "expo-linking";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { ComponentProps, useCallback } from 'react';
import { Image, Platform, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from 'sonner';
import AppProvider, { useApp } from './contexts/AppContext';
import AuthProvider, { useAuth } from './contexts/AuthContext';
import store, { persistor } from './redux/store';
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
    tabBarActiveTintColor: '#d40e0e',
    tabBarShowLabel: true,
    tabBarLabelStyle: {
      overflow: 'visible',
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
        title: 'Agenda des animes | MangaJap',
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
        title: 'Agenda des mangas | MangaJap',
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
        title: 'Découvrir | MangaJap',
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
        title: 'Profil | MangaJap',
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
      options: {
        title: 'Anime | MangaJap',
      },
    },
    AnimeCreate: {
      if: () => {
        const { user } = useAuth();
        return user != null;
      },
      screen: AnimeSaveScreen,
      linking: {
        path: 'mangajap/anime/add',
      },
      options: {
        title: 'Ajouter un anime | MangaJap',
      },
    },
    AnimeUpdate: {
      if: () => {
        const { user } = useAuth();
        return user != null;
      },
      screen: AnimeSaveScreen,
      linking: {
        path: 'mangajap/anime/:id/edit',
      },
      options: {
        title: 'Modifier - Anime | MangaJap',
      },
    },
    SeasonCreate: {
      if: () => {
        const { user } = useAuth();
        return user != null;
      },
      screen: SeasonSaveScreen,
      linking: {
        path: 'mangajap/anime/:animeId/season/add',
      },
      options: {
        title: 'Ajouter une saison | MangaJap',
      },
    },
    SeasonUpdate: {
      if: () => {
        const { user } = useAuth();
        return user != null;
      },
      screen: SeasonSaveScreen,
      linking: {
        path: 'mangajap/season/:seasonId/edit',
      },
      options: {
        title: 'Modifier la saison | MangaJap',
      },
    },
    EpisodeCreate: {
      if: () => {
        const { user } = useAuth();
        return user != null;
      },
      screen: EpisodeSaveScreen,
      linking: {
        path: 'mangajap/anime/:animeId/episode/add',
      },
      options: {
        title: 'Ajouter un épisode | MangaJap',
      },
    },
    EpisodeUpdate: {
      if: () => {
        const { user } = useAuth();
        return user != null;
      },
      screen: EpisodeSaveScreen,
      linking: {
        path: 'mangajap/episode/:episodeId/edit',
      },
      options: {
        title: 'Modifier l\'épisode | MangaJap',
      },
    },
    AnimeStaffCreate: {
      if: () => {
        const { user } = useAuth();
        return user != null;
      },
      screen: StaffSaveScreen,
      linking: {
        path: 'mangajap/anime/:animeId/staff/create',
      },
      options: {
        title: 'Ajouter un staff - Anime | MangaJap',
      },
    },
    AnimeFranchiseCreate: {
      if: () => {
        const { user } = useAuth();
        return user != null;
      },
      screen: FranchiseSaveScreen,
      linking: {
        path: 'mangajap/anime/:animeId/franchise/create',
      },
      options: {
        title: 'Ajouter une franchise - Anime | MangaJap',
      },
    },
    Manga: {
      screen: MangaScreen,
      linking: {
        path: 'mangajap/manga/:id',
      },
      options: {
        title: 'Manga | MangaJap',
      },
    },
    MangaCreate: {
      if: () => {
        const { user } = useAuth();
        return user != null;
      },
      screen: MangaSaveScreen,
      linking: {
        path: 'mangajap/manga/add',
      },
      options: {
        title: 'Ajouter un manga | MangaJap',
      },
    },
    MangaUpdate: {
      if: () => {
        const { user } = useAuth();
        return user != null;
      },
      screen: MangaSaveScreen,
      linking: {
        path: 'mangajap/manga/:id/edit',
      },
      options: {
        title: 'Modifier - Manga | MangaJap',
      },
    },
    VolumeCreate: {
      if: () => {
        const { user } = useAuth();
        return user != null;
      },
      screen: VolumeSaveScreen,
      linking: {
        path: 'mangajap/manga/:mangaId/volume/add',
      },
      options: {
        title: 'Ajouter un tome | MangaJap',
      },
    },
    VolumeUpdate: {
      if: () => {
        const { user } = useAuth();
        return user != null;
      },
      screen: VolumeSaveScreen,
      linking: {
        path: 'mangajap/volume/:volumeId/edit',
      },
      options: {
        title: 'Modifier le tome | MangaJap',
      },
    },
    ChapterCreate: {
      if: () => {
        const { user } = useAuth();
        return user != null;
      },
      screen: ChapterSaveScreen,
      linking: {
        path: 'mangajap/manga/:mangaId/chapter/add',
      },
      options: {
        title: 'Ajouter un chapitre | MangaJap',
      },
    },
    ChapterUpdate: {
      if: () => {
        const { user } = useAuth();
        return user != null;
      },
      screen: ChapterSaveScreen,
      linking: {
        path: 'mangajap/chapter/:chapterId/edit',
      },
      options: {
        title: 'Modifier le chapitre | MangaJap',
      },
    },
    MangaStaffCreate: {
      if: () => {
        const { user } = useAuth();
        return user != null;
      },
      screen: StaffSaveScreen,
      linking: {
        path: 'mangajap/manga/:mangaId/staff/create',
      },
      options: {
        title: 'Ajouter un staff - Manga | MangaJap',
      },
    },
    StaffUpdate: {
      if: () => {
        const { user } = useAuth();
        return user != null;
      },
      screen: StaffSaveScreen,
      linking: {
        path: 'mangajap/staff/:staffId/edit',
      },
      options: {
        title: 'Modifier le staff | MangaJap',
      },
    },
    MangaFranchiseCreate: {
      if: () => {
        const { user } = useAuth();
        return user != null;
      },
      screen: FranchiseSaveScreen,
      linking: {
        path: 'mangajap/manga/:mangaId/franchise/create',
      },
      options: {
        title: 'Ajouter une franchise - Manga | MangaJap',
      },
    },
    FranchiseUpdate: {
      if: () => {
        const { user } = useAuth();
        return user != null;
      },
      screen: FranchiseSaveScreen,
      linking: {
        path: 'mangajap/franchise/:franchiseId/edit',
      },
      options: {
        title: 'Modifier la franchise | MangaJap',
      },
    },
    Search: {
      screen: SearchScreen,
      linking: {
        path: 'mangajap/search',
      },
      options: {
        title: 'Rechercher | MangaJap',
      },
    },
    Profile: {
      screen: ProfileScreen,
      linking: {
        path: 'mangajap/profile/:id',
      },
      options: {
        title: 'Profil | MangaJap',
      },
    },
    ProfileEdit: {
      if: () => {
        const { isAuthenticated } = useAuth();
        return isAuthenticated;
      },
      screen: ProfileEditScreen,
      linking: {
        path: 'mangajap/profile/:id/edit',
      },
      options: {
        title: 'Modifier le profil | MangaJap',
      },
    },
    ProfileFollows: {
      screen: FollowsScreen,
      linking: {
        path: 'mangajap/profile/:userId/:type(followers|following)',
      },
      options: (props) => {
        const params = props.route.params as ComponentProps<typeof FollowsScreen>['route']['params'];

        return {
          title: params.type === 'followers' ? 'Abonnés | MangaJap'
            : params.type === 'following' ? 'Abonnement | MangaJap'
              : '',
        };
      },
    },
    ProfileLibrary: {
      screen: LibraryScreen,
      linking: {
        path: 'mangajap/profile/:userId/:type(anime-library|anime-favorites|manga-library|manga-favorites)',
      },
      options: (props) => {
        const params = props.route.params as ComponentProps<typeof LibraryScreen>['route']['params'];

        return {
          title: params.type === 'anime-library' ? 'Bibliothèque animes | MangaJap'
            : params.type === 'anime-favorites' ? 'Animes favoris | MangaJap'
              : params.type === 'manga-library' ? 'Bibliothèque mangas | MangaJap'
                : params.type === 'manga-favorites' ? 'Mangas favoris | MangaJap'
                  : '',
        };
      },
    },
    People: {
      screen: PeopleScreen,
      linking: {
        path: 'mangajap/people/:id',
      },
      options: {
        title: 'Personnalité | MangaJap',
      },
    },
    PeopleCreate: {
      if: () => {
        const { user } = useAuth();
        return user != null;
      },
      screen: PeopleSaveScreen,
      linking: {
        path: 'mangajap/people/add',
      },
      options: {
        title: 'Ajouter une personnalité | MangaJap',
      },
    },
    PeopleUpdate: {
      if: () => {
        const { user } = useAuth();
        return user != null;
      },
      screen: PeopleSaveScreen,
      linking: {
        path: 'mangajap/people/:peopleId/edit',
      },
      options: {
        title: 'Modifier - Personnalité | MangaJap',
      },
    },
    Settings: {
      if: () => {
        const { isAuthenticated } = useAuth();
        return isAuthenticated;
      },
      screen: SettingsScreen,
      linking: {
        path: 'mangajap/settings',
      },
      options: {
        title: 'Paramètres | MangaJap',
      },
    },
    NotFound: {
      screen: NotFoundScreen,
      linking: {
        path: 'mangajap/*',
      },
      options: {
        title: 'Page non trouvée | MangaJap',
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
  const { isReady: isAppReady, isOffline: isAppOffline } = useApp();
  const { isReady: isAuthReady } = useAuth();

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

      {isAppOffline && (
        <View
          style={{
            backgroundColor: '#d40e0e',
          }}
        >
          <Text
            style={{
              color: '#ffffff',
              padding: 3,
              textAlign: 'center',
            }}
          >
            Vous êtes en mode hors connexion
          </Text>
        </View>
      )}
      <Toaster />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </AppProvider>
      </PersistGate>
    </Provider>
  );
}

import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RefreshControl from '../../components/atoms/RefreshControl';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import Tabs from '../../components/organisms/Tabs';
import { useAuthContext } from '../../contexts/AuthContext';
import Header from './components/Header';
import { useProfile } from './hooks/useProfile';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AnimeTab from './tabs/AnimeTab';
import MangaTab from './tabs/MangaTab';

type Props = {
  userId?: string;
};

export default function ProfileScreen(props: Props) {
  const { user: authenticatedUser } = useAuthContext();
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  const { isLoading, user, followingUser, followedByUser } = useProfile(props);

  const userId = props.userId ?? authenticatedUser?.id;

  if (!userId) {
    if (authScreen === 'login') {
      return (
        <LoginScreen
          onNavigateToRegister={() => setAuthScreen('register')}
          style={styles.container}
        />
      );
    } else {
      return (
        <RegisterScreen
          onNavigateToLogin={() => setAuthScreen('login')}
          style={styles.container}
        />
      );
    }
  }

  if (!user || followingUser === undefined || followedByUser === undefined) {
    return (
      <LoadingScreen style={styles.container} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Tabs.Container
        title={user.pseudo}
        canGoBack={!!props.userId}
        menuItems={user.id === authenticatedUser?.id ? [
          {
            icon: 'edit',
            onPress: () => router.navigate({
              pathname: '/profile/edit',
              params: { userId: user.id },
            }),
          },
          {
            icon: 'settings',
            onPress: () => router.navigate('/settings'),
          },
        ] : []}
        CollapsibleComponent={() => (
          <Header
            isLoading={isLoading}
            user={user}
            followingUser={followingUser}
            followedByUser={followedByUser}
          />
        )}
      >
        <Tabs.Tab name="Anime">
          <AnimeTab
            isLoading={isLoading}
            user={user}
          />
        </Tabs.Tab>
        <Tabs.Tab name="Manga">
          <MangaTab
            isLoading={isLoading}
            user={user}
          />
        </Tabs.Tab>
      </Tabs.Container>

      <RefreshControl refreshing={isLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

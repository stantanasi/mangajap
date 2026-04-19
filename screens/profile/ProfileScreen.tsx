import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RefreshControl from '../../components/atoms/RefreshControl';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import Tabs from '../../components/organisms/Tabs';
import { useAuth } from '../../contexts/AuthContext';
import Header from './components/Header';
import { useProfile } from './hooks/useProfile';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AnimeTab from './tabs/AnimeTab';
import MangaTab from './tabs/MangaTab';

type Props = StaticScreenProps<{
  id: string;
} | undefined>;

export default function ProfileScreen({ route }: Props) {
  const navigation = useNavigation();
  const { user: authenticatedUser } = useAuth();
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  const { isLoading, user, followingUser, followedByUser } = useProfile(route.params);

  const userId = route.params?.id ?? authenticatedUser?.id;

  useEffect(() => {
    if (!user) return;

    navigation.setOptions({
      title: `${user.name} (@${user.pseudo}) - Profil | MangaJap`,
    });
  }, [user]);

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
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 16,
        }}
      >
        <Tabs.Container
          header={() => (
            <Header
              isLoading={isLoading}
              route={route}
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
      </ScrollView>

      <RefreshControl refreshing={isLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

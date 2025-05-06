import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimeCard from '../../components/molecules/AnimeCard';
import MangaCard from '../../components/molecules/MangaCard';
import { AuthContext } from '../../contexts/AuthContext';
import { Follow, User } from '../../models';
import Header from './components/Header';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

type Props = StaticScreenProps<{
  id: string;
} | undefined>;

export default function ProfileScreen({ route }: Props) {
  const navigation = useNavigation();
  const { user: authenticatedUser } = useContext(AuthContext);
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User>();
  const [followingUser, setFollowingUser] = useState<Follow | null>();
  const [followedByUser, setFollowedByUser] = useState<Follow | null>();

  const id = route.params?.id ?? authenticatedUser?.id;

  useEffect(() => {
    if (!id) return

    const prepare = async () => {
      const [user, isFollowingUser, isFollowedByUser] = await Promise.all([
        User.findById(id)
          .include({
            'anime-library': { anime: true },
            'manga-library': { manga: true },
            'anime-favorites': { anime: true },
            'manga-favorites': { manga: true },
          }),

        ...(authenticatedUser && id !== authenticatedUser.id
          ? [
            Follow.find({
              'follower': authenticatedUser.id,
              'followed': id,
            } as any).then((follows) => follows[0] ?? null),
            Follow.find({
              'follower': id,
              'followed': authenticatedUser.id,
            } as any).then((follows) => follows[0] ?? null),
          ]
          : [null, null]),
      ]);

      setUser(user);
      setFollowingUser(isFollowingUser);
      setFollowedByUser(isFollowedByUser);
    }

    const unsubscribe = navigation.addListener('focus', () => {
      prepare()
        .catch((err) => console.error(err));
    });

    return unsubscribe;
  }, [id]);

  if (!id) {
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
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 16,
        }}
      >
        <Header
          route={route}
          user={user}
          followingUser={followingUser}
          followedByUser={followedByUser}
          onFollowingChange={(follow) => setFollowingUser(follow)}
        />

        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 6,
            marginHorizontal: 16,
            marginTop: 20,
          }}
        >
          Statistiques
        </Text>

        <FlatList
          horizontal
          data={[
            { label: 'Animé suivis', value: user.followedAnimeCount },
            { label: 'Épisodes vus', value: user.episodesWatch },
            { label: 'Manga suivis', value: user.followedMangaCount },
            { label: 'Tomes lus', value: user.volumesRead },
            { label: 'Chapitres lus', value: user.chaptersRead },
          ]}
          keyExtractor={(item) => item.label}
          renderItem={({ item }) => (
            <View
              style={{
                minWidth: 200,
                alignItems: 'center',
                borderColor: '#ccc',
                borderRadius: 4,
                borderWidth: 1,
                gap: 6,
                paddingHorizontal: 16,
                paddingVertical: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 'bold',
                  marginHorizontal: 10,
                }}
              >
                {item.label}
              </Text>

              <View style={{ width: '100%', height: 1, backgroundColor: '#ccc' }} />

              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  marginHorizontal: 10,
                }}
              >
                {item.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
          ListHeaderComponent={() => <View style={{ width: 16 }} />}
          ListFooterComponent={() => <View style={{ width: 16 }} />}
        />

        <Pressable
          onPress={() => navigation.navigate('ProfileAnimeLibrary', { userId: user.id })}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            marginBottom: 6,
            marginHorizontal: 16,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              flex: 1,
              fontSize: 20,
              fontWeight: 'bold',
            }}
          >
            Anime
          </Text>

          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color="#000"
          />
        </Pressable>

        <FlatList
          horizontal
          data={user['anime-library']!.map((entry) => entry.anime!.copy({
            'anime-entry': entry,
          }))}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AnimeCard
              anime={item}
              onPress={() => navigation.navigate('Anime', { id: item.id })}
              showCheckbox={false}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
          ListHeaderComponent={() => <View style={{ width: 16 }} />}
          ListFooterComponent={() => <View style={{ width: 16 }} />}
        />

        {user['anime-favorites']!.length > 0 ? (
          <>
            <Pressable
              onPress={() => navigation.navigate('ProfileAnimeFavorites', { userId: user.id })}
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                marginBottom: 6,
                marginHorizontal: 16,
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: 20,
                  fontWeight: 'bold',
                }}
              >
                Anime préférés
              </Text>

              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="#000"
              />
            </Pressable>

            <FlatList
              horizontal
              data={user['anime-favorites']!.map((entry) => entry.anime!.copy({
                'anime-entry': entry,
              }))}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <AnimeCard
                  anime={item}
                  onPress={() => navigation.navigate('Anime', { id: item.id })}
                  showCheckbox={false}
                />
              )}
              ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
              ListHeaderComponent={() => <View style={{ width: 16 }} />}
              ListFooterComponent={() => <View style={{ width: 16 }} />}
            />
          </>
        ) : null}

        <Pressable
          onPress={() => navigation.navigate('ProfileMangaLibrary', { userId: user.id })}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            marginBottom: 6,
            marginHorizontal: 16,
            marginTop: 20,
          }}
        >
          <Text
            style={{
              flex: 1,
              fontSize: 20,
              fontWeight: 'bold',
            }}
          >
            Manga
          </Text>

          <MaterialIcons
            name="keyboard-arrow-right"
            size={24}
            color="#000"
          />
        </Pressable>

        <FlatList
          horizontal
          data={user['manga-library']!.map((entry) => entry.manga!.copy({
            'manga-entry': entry,
          }))}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MangaCard
              manga={item}
              onPress={() => navigation.navigate('Manga', { id: item.id })}
              showCheckbox={false}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
          ListHeaderComponent={() => <View style={{ width: 16 }} />}
          ListFooterComponent={() => <View style={{ width: 16 }} />}
        />

        {user['manga-favorites']!.length > 0 ? (
          <>
            <Pressable
              onPress={() => navigation.navigate('ProfileMangaFavorites', { userId: user.id })}
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                marginBottom: 6,
                marginHorizontal: 16,
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: 20,
                  fontWeight: 'bold',
                }}
              >
                Manga préférés
              </Text>

              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="#000"
              />
            </Pressable>

            <FlatList
              horizontal
              data={user['manga-favorites']!.map((entry) => entry.manga!.copy({
                'manga-entry': entry,
              }))}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <MangaCard
                  manga={item}
                  onPress={() => navigation.navigate('Manga', { id: item.id })}
                  showCheckbox={false}
                />
              )}
              ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
              ListHeaderComponent={() => <View style={{ width: 16 }} />}
              ListFooterComponent={() => <View style={{ width: 16 }} />}
            />
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    backgroundColor: '#ccc',
    borderRadius: 360,
    marginHorizontal: 16,
    marginTop: 16,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  pseudo: {
    color: '#a1a1a1',
    marginHorizontal: 16,
    textAlign: 'center',
  },
  bio: {
    marginHorizontal: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  metas: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 48,
    marginTop: 16,
  },
  meta: {
    alignItems: 'center',
    flex: 1,
  },
  metaValue: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  metaLabel: {},
  metaDivider: {
    width: 1,
    backgroundColor: '#ccc',
  },
});
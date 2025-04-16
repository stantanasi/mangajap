import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimeCard from '../../components/molecules/AnimeCard';
import MangaCard from '../../components/molecules/MangaCard';
import { AuthContext } from '../../contexts/AuthContext';
import { Follow, User } from '../../models';
import LoginContent from './LoginContent';
import RegisterContent from './RegisterContent';

const OptionsModal = ({ user, visible, onRequestClose }: {
  user: User,
  visible: boolean
  onRequestClose: () => void
}) => {
  const navigation = useNavigation();

  return (
    <Modal
      animationType="fade"
      onRequestClose={() => onRequestClose()}
      transparent
      visible={visible}
    >
      <Pressable
        onPress={() => onRequestClose()}
        style={{
          backgroundColor: '#00000052',
          flex: 1,
          justifyContent: 'flex-end',
        }}
      >
        <Pressable
          style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          <View
            style={{
              alignItems: 'center',
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
              flexDirection: 'row',
              gap: 16,
              padding: 18,
            }}
          >
            <Image
              source={{ uri: user.avatar ?? undefined }}
              style={{
                width: 50,
                aspectRatio: 1 / 1,
                backgroundColor: '#ccc',
                borderRadius: 360,
              }}
            />

            <Text
              style={{
                fontSize: 15,
              }}
            >
              {user.pseudo}
            </Text>
          </View>

          <Pressable
            onPress={() => {
              navigation.navigate('Settings', {});
              onRequestClose();
            }}
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              gap: 16,
              padding: 18,
            }}
          >
            <MaterialIcons
              name="settings"
              size={24}
              color="#000"
            />

            <Text
              style={{
                flex: 1,
                fontSize: 15,
              }}
            >
              Paramètres
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};


type Props = StaticScreenProps<{
  id?: string;
}>;

export default function ProfileScreen({ route }: Props) {
  const navigation = useNavigation();
  const { user: authenticatedUser } = useContext(AuthContext);
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User>();
  const [isFollowingUser, setIsFollowingUser] = useState<Follow | null>();
  const [isFollowedByUser, setIsFollowedByUser] = useState<Follow | null>();
  const [isFollowUpdating, setIsFollowUpdating] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);

  const id = route.params?.id ?? authenticatedUser?.id;

  useEffect(() => {
    if (!id) return

    const prepare = async () => {
      const [user, isFollowingUser, isFollowedByUser] = await Promise.all([
        User.findById(id)
          .include([
            'anime-library.anime',
            'manga-library.manga',
            'anime-favorites.anime',
            'manga-favorites.manga',
          ]),

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
      setIsFollowingUser(isFollowingUser);
      setIsFollowedByUser(isFollowedByUser);
    }

    const unsubscribe = navigation.addListener('focus', () => {
      prepare()
        .catch((err) => console.error(err));
    });

    return unsubscribe;
  }, [id]);

  if (!id) {
    return (
      <SafeAreaView style={styles.container}>
        {authScreen === 'login' ? (
          <LoginContent
            onNavigateToRegister={() => setAuthScreen('register')}
          />
        ) : (
          <RegisterContent
            onNavigateToLogin={() => setAuthScreen('login')}
          />
        )}
      </SafeAreaView>
    );
  }

  if (!user || isFollowingUser === undefined || isFollowedByUser === undefined) {
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
          paddingVertical: 16,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            marginHorizontal: 16,
          }}
        >
          <Image
            source={{ uri: user.avatar ?? undefined }}
            style={styles.avatar}
          />

          <View
            style={{
              flex: 1,
              marginLeft: 16,
            }}
          >
            <Text style={styles.pseudo}>
              {user.pseudo}
            </Text>

            <Text style={styles.bio}>
              {user.about}
            </Text>

            <Text
              style={{
                color: '#888',
                fontSize: 13,
                marginTop: 6,
              }}
            >
              <Text onPress={() => navigation.navigate('Follows', { type: 'followers', userId: id })}>
                <Text style={{ color: '#000', fontWeight: 'bold' }}>{user.followersCount}</Text>
                <Text> abonnées</Text>
              </Text>
              <Text style={{ color: '#000', fontWeight: 'bold' }}> • </Text>
              <Text onPress={() => navigation.navigate('Follows', { type: 'following', userId: id })}>
                <Text style={{ color: '#000', fontWeight: 'bold' }}>{user.followingCount}</Text>
                <Text> abonnements</Text>
              </Text>
            </Text>
          </View>
        </View>

        <View
          style={{
            alignItems: 'flex-start',
            marginBottom: 10,
            marginHorizontal: 16,
            marginTop: 20,
          }}
        >
          {authenticatedUser ? (
            id === authenticatedUser.id ? (
              <View style={{ alignItems: 'center', flexDirection: 'row', gap: 10 }}>
                <Text
                  onPress={() => navigation.navigate('ProfileEdit', { id: id })}
                  style={{
                    alignSelf: 'flex-start',
                    borderColor: '#000',
                    borderRadius: 360,
                    borderWidth: 1,
                    color: '#000',
                    fontWeight: 'bold',
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                  }}
                >
                  Modifier
                </Text>

                <MaterialIcons
                  name="more-vert"
                  size={24}
                  color="#000"
                  onPress={() => setOptionsVisible(true)}
                />
                <OptionsModal
                  user={user}
                  visible={optionsVisible}
                  onRequestClose={() => setOptionsVisible(false)}
                />
              </View>
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Pressable
                  disabled={isFollowUpdating}
                  onPress={() => {
                    setIsFollowUpdating(true);

                    const updateFollow = async () => {
                      if (!isFollowingUser) {
                        const isFollowingUser = new Follow({
                          follower: new User({ id: authenticatedUser.id }),
                          followed: user,
                        });

                        return isFollowingUser.save()
                          .then((follow) => setIsFollowingUser(follow));
                      } else {
                        return isFollowingUser.delete()
                          .then(() => setIsFollowingUser(null));
                      }
                    };

                    updateFollow()
                      .catch((err) => console.error(err))
                      .finally(() => setIsFollowUpdating(false));
                  }}
                  style={{
                    borderColor: !isFollowingUser ? '#ccc' : '#000',
                    borderRadius: 360,
                    borderWidth: 1,
                    flexDirection: 'row',
                    gap: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                  }}
                >
                  {isFollowUpdating && (
                    <ActivityIndicator
                      animating
                      color="#000"
                    />
                  )}
                  <Text
                    style={{
                      color: '#000',
                      fontWeight: 'bold',
                    }}
                  >
                    {!isFollowingUser ? "S'abonner" : 'Abonné'}
                  </Text>
                </Pressable>

                {isFollowedByUser ? (
                  <Text
                    style={{
                      color: '#888',
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    Vous suit
                  </Text>
                ) : null}
              </View>
            )
          ) : null}
        </View>

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
          onPress={() => navigation.navigate('Library', { type: 'anime-library', userId: user.id })}
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
            Animes
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
              screen="profile"
              anime={item}
              onPress={() => navigation.navigate('Anime', { id: item.id })}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
          ListHeaderComponent={() => <View style={{ width: 16 }} />}
          ListFooterComponent={() => <View style={{ width: 16 }} />}
        />

        {user['anime-favorites']!.length > 0 ? (
          <>
            <Pressable
              onPress={() => navigation.navigate('Library', { type: 'anime-favorites', userId: user.id })}
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
                Animes préférées
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
                  screen="profile"
                  anime={item}
                  onPress={() => navigation.navigate('Anime', { id: item.id })}
                />
              )}
              ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
              ListHeaderComponent={() => <View style={{ width: 16 }} />}
              ListFooterComponent={() => <View style={{ width: 16 }} />}
            />
          </>
        ) : null}

        <Pressable
          onPress={() => navigation.navigate('Library', { type: 'manga-library', userId: user.id })}
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
            Mangas
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
              screen="profile"
              manga={item}
              onPress={() => navigation.navigate('Manga', { id: item.id })}
            />
          )}
          ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
          ListHeaderComponent={() => <View style={{ width: 16 }} />}
          ListFooterComponent={() => <View style={{ width: 16 }} />}
        />

        {user['manga-favorites']!.length > 0 ? (
          <>
            <Pressable
              onPress={() => navigation.navigate('Library', { type: 'manga-favorites', userId: user.id })}
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
                Mangas préférées
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
                  screen="profile"
                  manga={item}
                  onPress={() => navigation.navigate('Manga', { id: item.id })}
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
    backgroundColor: '#ccc',
    borderRadius: 360,
  },
  pseudo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  bio: {
    color: '#444',
  },
});
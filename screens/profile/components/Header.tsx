import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../../contexts/AuthContext';
import { Follow, User } from '../../../models';
import ProfileScreen from '../ProfileScreen';

type Props = React.ComponentProps<typeof ProfileScreen> & {
  user: User;
  followingUser: Follow | null;
  followedByUser: Follow | null;
  onFollowingChange?: (follow: Follow | null) => void;
  style?: StyleProp<ViewStyle>;
}

export default function Header({
  route,
  user,
  followingUser: followingUser,
  followedByUser: followedByUser,
  onFollowingChange = () => { },
  style,
}: Props) {
  const navigation = useNavigation();
  const { user: authenticatedUser } = useContext(AuthContext);
  const [isFollowUpdating, setIsFollowUpdating] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.topBar}>
        {route.params ? (
          <MaterialIcons
            name="arrow-back"
            color="#000"
            size={24}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else if (typeof window !== 'undefined') {
                window.history.back();
              }
            }}
            style={styles.icon}
          />
        ) : null}

        <View style={{ flex: 1 }} />

        <MaterialIcons
          name="settings"
          color="#000"
          size={24}
          onPress={() => navigation.navigate('Settings')}
          style={styles.icon}
        />
      </View>

      <Image
        source={{ uri: user.avatar ?? undefined }}
        style={styles.avatar}
      />

      <Text style={styles.username}>
        {user.name}
      </Text>

      <Text style={styles.pseudo}>
        @{user.pseudo}
      </Text>

      <Text style={styles.bio}>
        {user.bio}
      </Text>

      <View style={styles.metas}>
        <Pressable
          onPress={() => navigation.navigate('ProfileFollowers', { userId: user.id })}
          style={styles.meta}
        >
          <Text style={styles.metaValue}>
            {user.followersCount}
          </Text>
          <Text style={styles.metaLabel}>
            Abonnés
          </Text>
        </Pressable>

        <View style={styles.metaDivider} />

        <Pressable
          onPress={() => navigation.navigate('ProfileFollowing', { userId: user.id })}
          style={styles.meta}
        >
          <Text style={styles.metaValue}>
            {user.followingCount}
          </Text>
          <Text style={styles.metaLabel}>
            Abonnements
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: 'row',
          gap: 16,
          marginHorizontal: 16,
          marginTop: 24,
        }}
      >
        {authenticatedUser ? (
          user.id === authenticatedUser.id ? (
            <Text
              onPress={() => navigation.navigate('ProfileEdit', { id: user.id })}
              style={{
                backgroundColor: '#ccc',
                borderRadius: 4,
                flex: 1,
                fontSize: 16,
                fontWeight: 'bold',
                paddingHorizontal: 12,
                paddingVertical: 10,
                textAlign: 'center',
                textTransform: 'uppercase',
              }}
            >
              Modifier
            </Text>
          ) : (
            <View
              style={{
                flex: 1,
              }}
            >
              <Pressable
                disabled={isFollowUpdating}
                onPress={() => {
                  setIsFollowUpdating(true);

                  const updateFollow = async () => {
                    if (!followingUser) {
                      const isFollowingUser = new Follow({
                        follower: new User({ id: authenticatedUser.id }),
                        followed: user,
                      });

                      return isFollowingUser.save()
                        .then((follow) => onFollowingChange(follow));
                    } else {
                      return followingUser.delete()
                        .then(() => onFollowingChange(null));
                    }
                  };

                  updateFollow()
                    .catch((err) => console.error(err))
                    .finally(() => setIsFollowUpdating(false));
                }}
                style={{
                  alignItems: 'center',
                  backgroundColor: '#ccc',
                  borderRadius: 4,
                  flexDirection: 'row',
                  gap: 10,
                  justifyContent: 'center',
                  paddingHorizontal: 12,
                  paddingVertical: 10,
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
                    textTransform: 'uppercase',
                  }}
                >
                  {!followingUser ? "S'abonner" : 'Abonné'}
                </Text>
              </Pressable>

              {followedByUser ? (
                <Text
                  style={{
                    alignSelf: 'center',
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    flexDirection: 'row',
  },
  icon: {
    padding: 12,
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

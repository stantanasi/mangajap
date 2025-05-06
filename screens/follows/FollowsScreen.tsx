import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserCard from '../../components/molecules/UserCard';
import { Follow, User } from '../../models';

type Props = StaticScreenProps<{
  userId: string;
}>;

export default function FollowsScreen({ route }: Props) {
  const navigation = useNavigation();
  const state = navigation.getState()!;
  const routeName = state.routes.at(state.index)?.name as keyof ReactNavigation.RootParamList;
  const [follows, setFollows] = useState<Follow[]>();

  const type = routeName === 'ProfileFollowers' ? 'followers'
    : routeName === 'ProfileFollowing' ? 'following'
      : null;

  useEffect(() => {
    const prepare = async () => {
      if (type === 'followers') {
        const followers = await User.findById(route.params.userId).get('followers')
          .include({ follower: true });

        setFollows(followers);
      } else if (type === 'following') {
        const following = await User.findById(route.params.userId).get('following')
          .include({ followed: true });

        setFollows(following);
      } else {
        throw Error('Library type not supported');
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      prepare()
        .catch((err) => console.error(err));
    });

    return unsubscribe;
  }, [route.params]);

  if (!follows) {
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
      <View
        style={{
          alignItems: 'flex-start',
          flexDirection: 'row',
        }}
      >
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
          style={{
            padding: 12,
          }}
        />

        <Text
          style={{
            flex: 1,
            fontSize: 18,
            fontWeight: 'bold',
            padding: 12,
          }}
        >
          {type === 'followers' ? 'Abonnés'
            : type === 'following' ? 'Abonnements'
              : ''}
        </Text>
      </View>

      <FlatList
        data={follows}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const state = navigation.getState()!;
          const routeName = state.routes.at(state.index)?.name as keyof ReactNavigation.RootParamList;

          const user = routeName === 'ProfileFollowers'
            ? item.follower!
            : item.followed!;
          return (
            <UserCard
              user={user}
              onPress={() => navigation.navigate('Profile', { id: user.id })}
              style={{
                marginHorizontal: 16,
              }}
            />
          );
        }}
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: '#ccc',
              marginVertical: 8,
            }}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

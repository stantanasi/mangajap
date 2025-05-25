import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserCard from '../../components/molecules/UserCard';
import { Follow, User } from '../../models';
import { useAppDispatch, useAppSelector } from '../../redux/store';

type Props = StaticScreenProps<{
  type: 'followers' | 'following';
  userId: string;
}>;

export default function FollowsScreen({ route }: Props) {
  const navigation = useNavigation();
  const { isLoading, follows } = useFollows(route.params);

  if (isLoading || !follows) {
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
          {route.params.type === 'followers' ? 'Abonnés'
            : route.params.type === 'following' ? 'Abonnements'
              : ''}
        </Text>
      </View>

      <FlatList
        data={follows}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const user = route.params.type === 'followers'
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


const useFollows = (params: Props['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const follows = useAppSelector((state) => {
    if (params.type === 'followers') {
      return User.redux.selectors.selectRelation(params.userId, 'followers', {
        include: {
          follower: true,
        },
        sort: {
          createdAt: 'desc',
        },
      })(state);
    } else if (params.type === 'following') {
      return User.redux.selectors.selectRelation(params.userId, 'following', {
        include: {
          followed: true,
        },
        sort: {
          createdAt: 'desc',
        },
      })(state);
    }

    return undefined;
  });

  useEffect(() => {
    const prepare = async () => {
      if (params.type === 'followers') {
        const followers = await User.findById(params.userId).get('followers')
          .include({ follower: true })
          .sort({ createdAt: 'desc' });

        dispatch(Follow.redux.actions.setMany(followers));
        dispatch(User.redux.actions.relations['followers'].set(params.userId, followers));
      } else if (params.type === 'following') {
        const following = await User.findById(params.userId).get('following')
          .include({ followed: true })
          .sort({ createdAt: 'desc' });

        dispatch(Follow.redux.actions.setMany(following));
        dispatch(User.redux.actions.relations['following'].set(params.userId, following));
      }
    };

    setIsLoading(true);
    prepare()
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [params]);

  return { isLoading, follows };
};

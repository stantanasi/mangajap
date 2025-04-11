import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UserCard from '../../components/molecules/UserCard';
import { Follow, User } from '../../models';

type Props = StaticScreenProps<{
  type: 'followers' | 'following';
  userId: string;
}>;

export default function FollowsScreen({ route }: Props) {
  const navigation = useNavigation();
  const [follows, setFollows] = useState<Follow[]>();

  useEffect(() => {
    const prepare = async () => {
      const userId = route.params.userId;

      if (route.params.type === 'followers') {
        const followers = await User.findById(userId).get('followers')
          .include(['follower']);

        setFollows(followers);
      } else {
        const following = await User.findById(userId).get('following')
          .include(['followed']);

        setFollows(following);
      }
    };

    prepare()
      .catch((err) => console.error(err));
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

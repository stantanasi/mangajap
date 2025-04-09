import { StaticScreenProps } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Follow, User } from '../../models';

type Props = StaticScreenProps<{
  type: 'followers' | 'following';
  userId: string;
}>;

export default function FollowsScreen({ route }: Props) {
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
  }, []);

  return (
    <SafeAreaView style={styles.container}>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
});

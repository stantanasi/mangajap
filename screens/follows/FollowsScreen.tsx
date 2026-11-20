import { router } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RefreshControl from '../../components/atoms/RefreshControl';
import Header from '../../components/molecules/Header';
import UserCard from '../../components/molecules/UserCard';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import { useFollows } from './hooks/useFollows';

type Props = {
  type: 'followers' | 'following';
  userId: string;
};

export default function FollowsScreen(props: Props) {
  const { isLoading, follows } = useFollows(props);

  if (!follows) {
    return (
      <LoadingScreen style={styles.container} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={props.type === 'followers' ? 'Abonnés'
          : props.type === 'following' ? 'Abonnements'
            : ''}
      />

      <FlatList
        data={follows}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const user = props.type === 'followers'
            ? item.follower
            : item.followed;
          if (!user) return null;
          return (
            <UserCard
              user={user}
              onPress={() => router.navigate({
                pathname: '/profile/[userId]',
                params: { userId: user.id },
              })}
              style={{
                marginHorizontal: 16,
              }}
            />
          );
        }}
        ListHeaderComponent={() => <View style={{ height: 16 }} />}
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
        ListFooterComponent={() => <View style={{ height: 16 }} />}
      />

      <RefreshControl refreshing={isLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

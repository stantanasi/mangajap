import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RefreshControl from '../../components/atoms/RefreshControl';
import UserCard from '../../components/molecules/UserCard';
import LoadingScreen from '../../components/organisms/LoadingScreen';
import { useFollows } from './hooks/useFollows';

type Props = StaticScreenProps<{
  type: 'followers' | 'following';
  userId: string;
}>;

export default function FollowsScreen({ route }: Props) {
  const navigation = useNavigation();
  const { isLoading, follows } = useFollows(route.params);

  if (!follows) {
    return (
      <LoadingScreen style={styles.container} />
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
            ? item.follower
            : item.followed;
          if (!user) return null;
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

      <RefreshControl refreshing={isLoading} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

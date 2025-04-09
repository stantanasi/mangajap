import React from 'react';
import { Image, Pressable, PressableProps, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { User } from '../../models';

type Props = PressableProps & {
  user: User;
  style?: ViewStyle;
}

export default function UserCard({ user, style, ...props }: Props) {
  return (
    <Pressable
      {...props}
      style={[styles.container, style]}
    >
      <Image
        source={{ uri: user.avatar ?? undefined }}
        resizeMode="cover"
        style={styles.avatar}
      />

      <View style={{ flex: 1, padding: 10 }}>
        <Text style={styles.title}>
          {user.pseudo}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
  },
  avatar: {
    width: 60,
    aspectRatio: 1 / 1,
    backgroundColor: '#ccc',
    borderRadius: 360,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

import React from 'react';
import { Image, Pressable, PressableProps, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Anime } from '../../models';

type Props = PressableProps & {
  anime: Anime;
  style?: ViewStyle;
}

export default function AnimeSearchCard({ anime, style, ...props }: Props) {
  return (
    <Pressable
      {...props}
      style={[styles.container, style]}
    >
      <Image
        source={{ uri: anime.poster ?? undefined }}
        resizeMode="cover"
        style={styles.image}
      />

      <View style={{ flex: 1, padding: 10 }}>
        <Text
          numberOfLines={2}
          style={styles.title}
        >
          {anime.title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  image: {
    width: 80,
    aspectRatio: 2 / 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

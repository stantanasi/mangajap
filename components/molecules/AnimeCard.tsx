import React from 'react';
import { Image, Pressable, PressableProps, StyleSheet, Text, ViewStyle } from 'react-native';
import { Anime } from '../../models';

type Props = PressableProps & {
  anime: Anime;
  style?: ViewStyle;
}

export default function AnimeCard({ anime, style, ...props }: Props) {
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

      <Text
        numberOfLines={2}
        style={styles.title}
      >
        {anime.title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 130,
  },
  image: {
    width: '100%',
    aspectRatio: 2 / 3,
    backgroundColor: '#ccc',
  },
  title: {
    textAlign: 'center',
  },
});

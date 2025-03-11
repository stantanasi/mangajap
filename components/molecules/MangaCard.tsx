import React from 'react';
import { Image, Pressable, PressableProps, StyleSheet, Text, ViewStyle } from 'react-native';
import { Manga } from '../../models';

type Props = PressableProps & {
  manga: Manga;
  style?: ViewStyle;
}

export default function MangaCard({ manga, style, ...props }: Props) {
  return (
    <Pressable
      {...props}
      style={[styles.container, style]}
    >
      <Image
        source={{ uri: manga.poster ?? undefined }}
        resizeMode="cover"
        style={styles.image}
      />

      <Text
        numberOfLines={2}
        style={styles.title}
      >
        {manga.title}
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
  },
  title: {
    textAlign: 'center',
  },
});

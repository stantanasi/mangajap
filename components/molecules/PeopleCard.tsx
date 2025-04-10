import React from 'react';
import { Image, Pressable, PressableProps, StyleSheet, Text, ViewStyle } from 'react-native';
import { People } from '../../models';

type Props = PressableProps & {
  people: People;
  style?: ViewStyle;
};

export default function PeopleCard({ people, style, ...props }: Props) {
  return (
    <Pressable
      {...props}
      style={[styles.container, style]}
    >
      <Image
        source={{ uri: people.portrait ?? undefined }}
        style={styles.image}
      />

      <Text style={styles.name}>
        {people.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 130,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    aspectRatio: 1 / 1,
    backgroundColor: '#ccc',
    borderRadius: 360,
  },
  name: {
    textAlign: 'center',
  },
});

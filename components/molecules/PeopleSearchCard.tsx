import React from 'react';
import { Image, Pressable, PressableProps, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { People } from '../../models';

type Props = PressableProps & {
  people: People;
  style?: ViewStyle;
};

export default function PeopleSearchCard({ people, style, ...props }: Props) {
  return (
    <Pressable
      {...props}
      style={[styles.container, style]}
    >
      <Image
        source={{ uri: people.portrait ?? undefined }}
        style={styles.image}
      />

      <View style={{ flex: 1, padding: 10 }}>
        <Text style={styles.name}>
          {people.name}
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
    aspectRatio: 1 / 1,
    backgroundColor: '#ccc',
    borderRadius: 360,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

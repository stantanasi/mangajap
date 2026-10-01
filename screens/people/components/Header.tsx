import React from 'react';
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { People } from '../../../models';

type Props = {
  people: People;
  style?: StyleProp<ViewStyle>;
};

export default function Header({ people, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri: people.portrait ?? undefined }}
        style={styles.image}
      />

      <Text style={styles.name}>
        {people.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  image: {
    width: 180,
    alignSelf: 'center',
    aspectRatio: 1 / 1,
    backgroundColor: '#ccc',
    borderRadius: 360,
    marginHorizontal: 16,
  },
  name: {
    color: '#000',
    fontSize: 26,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});

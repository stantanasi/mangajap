import React from 'react';
import { Image, ImageStyle, Pressable, PressableProps, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { People } from '../../models';

type Variants = 'default' | 'horizontal';

type Props = PressableProps & {
  people: People;
  variant?: Variants;
  style?: StyleProp<ViewStyle>;
};

export default function PeopleCard({
  people,
  variant = 'default',
  style,
  ...props
}: Props) {
  return (
    <Pressable
      {...props}
      style={[styles.container, styles[variant].container, style]}
    >
      <Image
        source={{ uri: people.portrait ?? undefined }}
        style={[styles.image, styles[variant].image]}
      />

      <View style={[styles.infos, styles[variant].infos]}>
        <Text style={[styles.name, styles[variant].name]}>
          {people.name}
        </Text>
      </View>
    </Pressable>
  );
}

type Style = {
  container: ViewStyle;
  image: ImageStyle;
  infos: ViewStyle;
  name: TextStyle;
};

const styles: Style & Record<Variants, Style> = {
  ...StyleSheet.create<Style>({
    container: {
      alignItems: 'center',
    },
    image: {
      aspectRatio: 1 / 1,
      backgroundColor: '#ccc',
      borderRadius: 360,
    },
    infos: {},
    name: {},
  }),

  default: StyleSheet.create<Style>({
    container: {
      width: 130,
    },
    image: {
      width: '100%',
    },
    infos: {},
    name: {
      textAlign: 'center',
    },
  }),

  horizontal: StyleSheet.create<Style>({
    container: {
      flexDirection: 'row',
    },
    image: {
      width: 80,
    },
    infos: {
      flex: 1,
      padding: 10,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  }),
};

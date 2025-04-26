import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Image, ImageStyle, Pressable, PressableProps, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { People, Staff } from '../../models';

type Variants = 'default' | 'horizontal';

type Props = PressableProps & {
  people: People;
  staff?: Staff;
  variant?: Variants;
  editable?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function PeopleCard({
  people,
  staff,
  variant = 'default',
  editable = false,
  style,
  ...props
}: Props) {
  return (
    <Pressable
      {...props}
      style={[styles.container, styles[variant].container, style]}
    >
      <View
        style={{
          width: styles[variant].image.width ?? styles.image.width,
          height: styles[variant].image.height ?? styles.image.height,
        }}
      >
        <Image
          source={{ uri: people.portrait ?? undefined }}
          style={[styles.image, styles[variant].image]}
        />

        {editable ? (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              top: 0,
              alignItems: 'center',
              backgroundColor: '#00000080',
              borderRadius: styles.image.borderRadius,
              justifyContent: 'center',
            }}
          >
            <MaterialIcons
              name="edit"
              color="#fff"
              size={24}
            />
          </View>
        ) : null}
      </View>

      <View style={[styles.infos, styles[variant].infos]}>
        <Text style={[styles.name, styles[variant].name]}>
          {people.name}
        </Text>

        {staff ? (
          <Text style={[styles.role, styles[variant].role]}>
            {(() => {
              const roleLabels: Record<typeof staff.role, string> = {
                author: 'Scénariste',
                illustrator: 'Dessinateur',
                story_and_art: 'Créateur',
                licensor: 'Éditeur',
                producer: 'Producteur',
                studio: 'Studio',
                original_creator: 'Créateur original',
              };

              return roleLabels[staff.role];
            })()}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

type Style = {
  container: ViewStyle;
  image: ImageStyle;
  infos: ViewStyle;
  name: TextStyle;
  role: TextStyle;
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
    role: {},
  }),

  default: StyleSheet.create<Style>({
    container: {
      width: 130,
    },
    image: {
      width: '100%',
    },
    infos: {
      alignItems: 'center',
    },
    name: {
      textAlign: 'center',
    },
    role: {
      color: '#888',
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
    role: {},
  }),
};

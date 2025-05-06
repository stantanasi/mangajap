import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Image, Pressable, PressableProps, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { People, Staff } from '../../models';
import { StaffRole } from '../../models/staff.model';

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
      style={[styles.base.container, styles[variant].container, style]}
    >
      <View style={[styles.base.imageContainer, styles[variant].imageContainer]}>
        <Image
          source={{ uri: people.portrait ?? undefined }}
          style={[styles.base.image, styles[variant].image]}
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

      <View style={[styles.base.infos, styles[variant].infos]}>
        <Text style={[styles.base.name, styles[variant].name]}>
          {people.name}
        </Text>

        {staff ? (
          <Text style={[styles.base.role, styles[variant].role]}>
            {StaffRole[staff.role]}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = {
  base: StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    imageContainer: {
      aspectRatio: 1 / 1,
      borderRadius: 360,
      overflow: 'hidden',
    },
    image: {
      backgroundColor: '#ccc',
    },
    infos: {},
    name: {},
    role: {},
  }),

  default: StyleSheet.create({
    container: {
      width: 130,
    },
    imageContainer: {
      width: '100%',
    },
    image: {
      width: '100%',
      height: '100%',
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

  horizontal: StyleSheet.create({
    container: {
      flexDirection: 'row',
    },
    imageContainer: {
      width: 80,
    },
    image: {
      width: '100%',
      height: '100%',
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
} satisfies Record<'base' | Variants, Record<string, any>>;

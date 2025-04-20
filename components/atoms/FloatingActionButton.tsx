import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

type Props = PressableProps & {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label?: string;
  style?: StyleProp<ViewStyle>;
}

export default function FloatingActionButton({ icon, label, style, ...props }: Props) {
  return (
    <Pressable
      {...props}
      style={[styles.container, style]}
    >
      <MaterialIcons
        name={icon}
        size={24}
        color="#fff"
        style={styles.icon}
      />

      {label ? (
        <Text style={styles.label}>
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: '#4281f5',
    borderRadius: 16,
    elevation: 5,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    marginRight: 16,
    minWidth: 80,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  icon: {},
  label: {
    color: '#fff',
    fontSize: 16,
  },
});

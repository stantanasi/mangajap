import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  loading?: boolean;
  style?: ViewStyle;
};

export default function Checkbox({
  value,
  onValueChange,
  loading = false,
  style,
}: Props) {

  if (loading) {
    return (
      <ActivityIndicator
        animating
        color={!value ? '#7e7e7e' : '#fff'}
        size={20}
        style={[styles.container, { backgroundColor: !value ? '#e5e5e5' : '#4281f5' }, style]}
      />
    );
  }

  return (
    <MaterialIcons
      name="check"
      size={20}
      color={!value ? '#7e7e7e' : '#fff'}
      onPress={() => onValueChange(!value)}
      style={[styles.container, { backgroundColor: !value ? '#e5e5e5' : '#4281f5' }, style]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 360,
    padding: 8,
  },
});

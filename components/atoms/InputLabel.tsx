import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

type Props = TextProps

export default function InputLabel({ style, ...props }: Props) {
  return (
    <Text
      {...props}
      style={[styles.label, style]}
    />
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
  },
});

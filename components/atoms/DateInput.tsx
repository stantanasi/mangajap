import React, { useState } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import DateTimePicker from './DateTimePicker';
import InputLabel from './InputLabel';

type Props = {
  label?: string;
  value: Date | undefined;
  onValueChange: (value: Date | undefined) => void;
  style?: StyleProp<ViewStyle>;
}

export default function DateInput({ label, value, onValueChange, style }: Props) {
  const [visiblePicker, setVisiblePicker] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <InputLabel>
          {label}
        </InputLabel>
      ) : null}

      <Text
        onPress={() => setVisiblePicker(true)}
        style={[styles.input, !value ? {
          color: '#666',
        } : {}]}
      >
        {value?.toLocaleDateString() ?? 'jj/mm/aaaa'}
      </Text>

      <DateTimePicker
        value={value ?? new Date()}
        onValueChange={(value) => onValueChange(value)}
        onRequestClose={() => setVisiblePicker(false)}
        visible={visiblePicker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  input: {
    borderColor: '#ccc',
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
});

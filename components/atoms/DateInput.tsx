import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
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

      {visiblePicker && (
        <DateTimePicker
          value={value ?? new Date()}
          onChange={(_, date) => {
            onValueChange(date);
            setVisiblePicker(false);
          }}
          mode="date"
        />
      )}
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

import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import InputLabel from './InputLabel';

type Props<T> = {
  label?: string;
  values: {
    label: string;
    value: T;
  }[];
  selectedValue: T | undefined;
  onValueChange: (itemValue: T, itemIndex: number) => void;
  style?: StyleProp<ViewStyle>;
}

export default function SelectInput<T extends string>({
  label,
  values,
  selectedValue,
  onValueChange,
  style,
}: Props<T>) {
  return (
    <View style={[styles.container, style]}>
      {label ? (
        <InputLabel>
          {label}
        </InputLabel>
      ) : null}

      <View style={styles.input}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(value, index) => {
            if (value) {
              return onValueChange(value, index)
            }
          }}
          mode="dialog"
          style={{
            margin: -16,
          }}
        >
          <Picker.Item
            label="Sélectionner"
            value=""
          />
          {values.map((value) => (
            <Picker.Item
              key={value.value}
              label={value.label}
              value={value.value}
            />
          ))}
        </Picker>
      </View>
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

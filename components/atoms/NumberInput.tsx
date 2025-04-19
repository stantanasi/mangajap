import React, { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import TextInput from './TextInput';

type Props = Omit<TextInputProps, 'value' | 'onChangeText'> & {
  label?: string;
  value?: number;
  onValueChange?: (value: number) => void;
  decimal?: boolean;
  negative?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function NumberInput({
  label,
  value,
  onValueChange = () => { },
  decimal = true,
  negative = true,
  style,
  ...props
}: Props) {
  const [text, setText] = useState(value?.toString() ?? '');

  useEffect(() => {
    if (+text !== value) {
      setText((value || undefined)?.toString() ?? '');
    }
  }, [value]);

  return (
    <TextInput
      label={label}
      {...props}
      inputMode="numeric"
      value={text}
      onChangeText={(text) => {
        const regex = decimal && negative
          ? /^-?\d*\.?\d*$/
          : decimal && !negative
            ? /^\d*\.?\d*$/
            : !decimal && negative
              ? /^-?\d*$/
              : /^\d*$/

        if (regex.test(text)) {
          setText(text)

          const value = +text
          if (!isNaN(value)) {
            onValueChange(value)
          }
        }
      }}
      style={[styles.input, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {},
});

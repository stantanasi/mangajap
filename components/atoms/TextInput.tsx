import React, { useState } from 'react';
import { StyleProp, StyleSheet, Text, TextInputProps, TextInput as TextInputRN, View, ViewStyle } from 'react-native';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
}

export default function TextInput({ label, error, style, ...props }: Props) {
  const [height, setHeight] = useState(0);

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <Text style={styles.label}>
          {label}
        </Text>
      ) : null}

      <TextInputRN
        placeholderTextColor="#666"
        {...props}
        onContentSizeChange={(event) => setHeight(event.nativeEvent.contentSize.height)}
        style={[
          styles.input,
          { textAlign: props.textAlign },
          { minHeight: Math.max(35, height + styles.input.borderWidth * 2) },
        ]}
      />

      {error ? (
        <Text
          style={{
            color: '#f00',
            fontSize: 10,
            fontStyle: 'italic',
          }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  label: {
    fontSize: 12,
  },
  input: {
    borderColor: '#ccc',
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
});

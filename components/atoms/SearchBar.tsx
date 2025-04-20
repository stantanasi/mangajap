import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

type Props = Omit<TextInputProps, 'style'> & {
  onSearch?: (query: string) => void;
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

export default function SearchBar({
  value = '',
  onSearch = () => { },
  delay = 0,
  style,
  ...props
}: Props) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(query);
    }, delay);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <View style={[styles.container, style]}>
      <MaterialIcons
        name="search"
        size={24}
        color="#666"
      />

      <TextInput
        placeholder="Rechercher"
        placeholderTextColor="#666"
        returnKeyType="search"
        {...props}
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          props.onChangeText?.(text);
        }}
        onSubmitEditing={() => onSearch(query)}
        style={styles.input}
      />

      {query !== '' && (
        <MaterialIcons
          name="close"
          color="#666"
          size={24}
          onPress={() => {
            setQuery('');
            props.onChangeText?.('');
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
});

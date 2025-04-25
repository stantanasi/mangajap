import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import InputLabel from './InputLabel';

type Props<T> = {
  label?: string;
  items: {
    label: string;
    value: T;
  }[];
  selectedValue: T | undefined;
  onValueChange: (itemValue: T, itemIndex: number) => void;
  style?: StyleProp<ViewStyle>;
}

export default function SelectInput<T extends string>({
  label,
  items,
  selectedValue,
  onValueChange,
  style,
}: Props<T>) {
  const [optionsVisible, setOptionsVisible] = useState(false);

  items = [
    { label: 'Sélectionner', value: '' as T },
    ...items,
  ];

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <InputLabel>
          {label}
        </InputLabel>
      ) : null}

      <Pressable
        onPress={() => setOptionsVisible(true)}
        style={[styles.input, {
          alignItems: 'center',
          flexDirection: 'row',
        }]}
      >
        <Text
          style={{
            flex: 1,
          }}
        >
          {items.find((value) => value.value === selectedValue)?.label
            ?? items[0]?.label}
        </Text>

        <MaterialIcons
          name={!optionsVisible ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
          color="#000"
          size={18}
        />
      </Pressable>

      <Modal
        animationType="fade"
        onRequestClose={() => setOptionsVisible(false)}
        transparent
        visible={optionsVisible}
      >
        <Pressable
          onPress={() => setOptionsVisible(false)}
          style={{
            alignItems: 'center',
            backgroundColor: '#00000052',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <Pressable
            style={{
              width: '90%',
              backgroundColor: '#fff',
              borderRadius: 4,
              gap: 12,
              maxHeight: '90%',
            }}
          >
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item, index }) => (
                <Text
                  onPress={() => {
                    onValueChange(item.value, index);
                    setOptionsVisible(false);
                  }}
                  style={styles.item}
                >
                  {item.label}
                </Text>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
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
  item: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

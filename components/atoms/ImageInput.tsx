import React from 'react'
import { Image, ImageStyle, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import InputLabel from './InputLabel';
import { launchImageLibraryAsync } from 'expo-image-picker';
import AutoHeightImage from './AutoHeightImage';

type Props = {
  label?: string;
  value: string | null | undefined;
  onValueChange: (value: string | null) => void;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
}

export default function ImageInput({ label, value, onValueChange, style, inputStyle }: Props) {
  return (
    <View style={[styles.container, style]}>
      {label ? (
        <InputLabel>
          {label}
        </InputLabel>
      ) : null}

      <Pressable
        onPress={() => {
          launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            base64: true,
            quality: 1,
          })
            .then((result) => {
              if (result.canceled) return

              const base64 = result.assets[0].base64;
              if (!base64) return

              onValueChange(`data:image/jpg;base64,${base64}`);
            })
            .catch((err) => console.error(err));
        }}
        style={[styles.input, inputStyle]}
      >
        <AutoHeightImage
          source={{ uri: value ?? undefined }}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  input: {
    borderColor: '#ccc',
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
  },
});

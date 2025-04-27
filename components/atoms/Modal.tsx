import React, { PropsWithChildren } from 'react';
import { Modal as ModalRN, Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';

type Props = PropsWithChildren & {
  onRequestClose: () => void;
  visible: boolean;
  position?: 'center' | 'flex-start' | 'flex-end';
  style?: StyleProp<ViewStyle>;
}

export default function Modal({
  children,
  onRequestClose,
  visible,
  position = 'center',
  style,
}: Props) {
  return (
    <ModalRN
      animationType="fade"
      onRequestClose={onRequestClose}
      transparent
      visible={visible}
    >
      <Pressable
        onPress={onRequestClose}
        style={[styles.background, {
          justifyContent: position,
        }]}
      >
        <Pressable style={[styles.container, style]}>
          {children}
        </Pressable>
      </Pressable>
    </ModalRN>
  );
}

const styles = StyleSheet.create({
  background: {
    alignItems: 'center',
    backgroundColor: '#00000052',
    flex: 1,
  },
  container: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 4,
    maxHeight: '90%',
    maxWidth: '90%',
  },
});

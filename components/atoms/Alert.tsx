import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from './Modal';

type Props = {
  title: string;
  message?: string;
  buttons?: {
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
  }[];
  visible: boolean;
  onRequestClose: () => void;
};

export default function Alert({
  title,
  message,
  buttons,
  visible,
  onRequestClose,
}: Props) {
  return (
    <Modal
      onRequestClose={onRequestClose}
      visible={visible}
      style={styles.container}
    >
      <Text style={styles.title}>
        {title}
      </Text>

      {message ? (
        <Text style={styles.message}>
          {message}
        </Text>
      ) : null}

      <View style={styles.buttons}>
        {buttons?.map((button) => (
          <Text
            onPress={() => {
              button.onPress?.();
              onRequestClose();
            }}
            style={[styles.button, button.style === 'cancel' ? {
              color: '#374151',
            } : button.style === 'destructive' ? {
              color: '#ef4444',
            } : {}]}
          >
            {button.text}
          </Text>
        ))}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
  },
  buttons: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    padding: 12,
  },
});

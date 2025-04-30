import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import Modal from './Modal';

type Props = {
  value: Date;
  onValueChange?: (value: Date) => void;
  onRequestClose: () => void;
  visible: boolean;
}

export default function DateTimePicker({
  value,
  onValueChange = () => { },
  onRequestClose,
  visible,
}: Props) {
  const [activeDate, setActiveDate] = useState<Date>(value);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);

  useEffect(() => {
    setActiveDate(value);
    setSelectedDate(value);
  }, [value]);

  return (
    <Modal
      onRequestClose={onRequestClose}
      visible={visible}
      style={styles.container}
    >
      <Text>
        Sélectionner une date
      </Text>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {},
});

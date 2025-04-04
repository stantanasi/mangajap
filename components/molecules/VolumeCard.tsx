import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Volume } from '../../models';

type Props = {
  volume: Volume;
}

export default function VolumeCard({ volume }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.number}>
        Tome {volume.number}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  number: {},
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Season } from '../../models';

type Props = {
  season: Season;
}

export default function SeasonCard({ season }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.number}>
        Saison {season.number}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  number: {},
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Episode } from '../../models';

type Props = {
  episode: Episode;
}

export default function EpisodeCard({ episode }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.number}>
        Episode {episode.number}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  number: {},
});

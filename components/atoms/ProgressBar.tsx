import React from 'react';
import { ColorValue, StyleSheet, View, ViewStyle } from 'react-native';

type Props = {
  /** Progress from 0 to 100 */
  progress: number;
  /** Fill color of the progress bar (default: #000) */
  color?: ColorValue;
  /** Background color of the progress bar container (default: #bbb) */
  backgroundColor?: ColorValue;
  style?: ViewStyle;
}

export default function ProgressBar({
  progress,
  color = '#000',
  backgroundColor = '#bbb',
  style,
}: Props) {
  return (
    <View style={[styles.container, style, { backgroundColor: backgroundColor }]}>
      <View
        style={[
          styles.progress,
          {
            width: `${Math.min(Math.max(progress, 0), 100)}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 5,
  },
  progress: {
    height: '100%',
  },
});

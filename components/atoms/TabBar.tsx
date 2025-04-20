import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props<T> = {
  selected: T;
  tabs: { key: T; title: string }[];
  onTabChange: (key: T) => void;
  style?: StyleProp<ViewStyle>;
};

export default function TabBar<T extends string>({ selected, tabs, onTabChange, style }: Props<T>) {
  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          onPress={() => onTabChange(tab.key)}
          style={styles.tab}
        >
          <Text
            style={[styles.title, selected === tab.key ? {
              color: '#000',
            } : {}]}
          >
            {tab.title}
          </Text>

          <View
            style={[styles.indicator, selected === tab.key ? {
              backgroundColor: '#4281f5',
            } : {}]}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  tab: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    color: '#888',
    fontWeight: 'bold',
    padding: 10,
    textTransform: 'uppercase',
  },
  indicator: {
    width: '100%',
    height: 4,
  },
});

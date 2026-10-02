import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
  label: string;
  subtitle?: string;
  icon?: React.ComponentProps<typeof MaterialIcons>['name'];
  danger?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function SettingRow({
  label,
  subtitle,
  icon,
  danger,
  onPress,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, style]}
    >
      <MaterialIcons
        name={icon}
        size={22}
        color={danger ? '#ef4444' : styles.label.color}
      />

      <View style={{ flex: 1 }}>
        <Text style={[styles.label, danger && { color: '#ef4444' }]}>
          {label}
        </Text>

        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <MaterialIcons
        name="chevron-right"
        size={24}
        color={danger ? '#ef4444' : styles.label.color}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
});

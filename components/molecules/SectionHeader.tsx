import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
  title: string;
  subtitle?: string;
  count?: number;
  style?: StyleProp<ViewStyle>;
};

export default function SectionHeader({
  title,
  subtitle,
  count,
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={{ gap: 1 }}>
        <Text style={styles.title}>
          {title}
        </Text>

        {subtitle && (
          <Text style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </View>

      {count && (
        <Text style={styles.count}>
          {count}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'space-between',
  },
  title: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 12,
  },
  count: {
    backgroundColor: 'rgba(212, 14, 14, 0.1)',
    borderRadius: 360,
    color: '#d40e0e',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});

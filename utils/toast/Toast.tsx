import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ToastProps = {
  id: string;
  title: string;
  description?: string;
  variant: 'info' | 'success' | 'error';
  duration?: number;
  onDismiss?: (id: string) => void;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function Toast({
  id,
  title,
  description,
  variant,
  duration,
  onDismiss,
  onPress,
  style,
}: ToastProps) {
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  const dismiss = () => {
    translateY.value = withTiming(20, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(onDismiss ?? (() => { }))(id);
    });
  };

  useEffect(() => {
    translateY.value = withTiming(0, { duration: 250 });
    opacity.value = withTiming(1, { duration: 250 });

    const timer = setTimeout(() => {
      dismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressable
      onPress={() => {
        onPress?.();
        dismiss();
      }}
      style={[styles.container, animatedStyle, style]}
    >
      {variant === 'success' ? (
        <MaterialIcons
          name="check-circle"
          size={22}
          color="#000"
          style={styles.icon}
        />
      ) : variant === 'error' ? (
        <MaterialIcons
          name="error"
          size={22}
          color="#000"
          style={styles.icon}
        />
      ) : null}

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>
          {title}
        </Text>

        {description ? (
          <Text style={styles.description}>
            {description}
          </Text>
        ) : null}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    minWidth: 280,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  description: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
});
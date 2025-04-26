import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useState } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import FloatingActionButton from '../atoms/FloatingActionButton';

type Props = PressableProps & {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  menuItems: Parameters<typeof FloatingActionButton>[0][];
  style?: StyleProp<ViewStyle>;
}

export default function ExpandableFloatingActionButton({
  icon,
  menuItems,
  style,
  ...props
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen ? (
        <Pressable
          onPress={() => setIsOpen(false)}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            top: 0,
            backgroundColor: '#00000060'
          }}
        />
      ) : null}

      <View style={[styles.container, style]}>
        {isOpen ? (
          <View
            style={{
              alignItems: 'center',
              gap: 10,
            }}
          >
            {menuItems.map((item) => (
              <FloatingActionButton
                size="small"
                {...item}
                style={[{
                  margin: 0,
                  position: 'relative',
                }, item.style]}
              />
            ))}
          </View>
        ) : null}

        <FloatingActionButton
          icon={!isOpen ? icon : 'close'}
          size="large"
          onPress={() => setIsOpen((prev) => !prev)}
          style={{
            margin: 0,
            position: 'relative',
          }}
          {...props}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    alignItems: 'center',
    gap: 12,
    justifyContent: 'flex-end',
    marginBottom: 16,
    marginRight: 16,
  },
});

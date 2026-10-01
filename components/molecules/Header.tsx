import React, { ComponentProps, PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import TopBar from '../atoms/TopBar';

type Props = PropsWithChildren & ComponentProps<typeof TopBar> & {
  style?: StyleProp<ViewStyle>;
  TopBarComponent?: (props: ComponentProps<typeof TopBar>) => React.ReactElement;
};

export default function Header({
  children,
  title,
  canGoBack = true,
  menuItems = [],
  style,
  TopBarComponent = (props) => TopBar(props),
}: Props) {
  return (
    <View style={[styles.container, style]}>
      {TopBarComponent({ title, canGoBack, menuItems })}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
});

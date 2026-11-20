import { MaterialIcons } from '@react-native-vector-icons/material-icons';
import { router } from 'expo-router';
import { ComponentProps, ReactElement } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
  title?: string | ReactElement;
  canGoBack?: boolean;
  menuItems?: {
    icon: ComponentProps<typeof MaterialIcons>['name'];
    onPress?: () => void;
  }[];
  style?: StyleProp<ViewStyle>;
};

export default function TopBar({
  title,
  canGoBack = true,
  menuItems = [],
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      {canGoBack ? (
        <MaterialIcons
          name="arrow-back"
          color="#000"
          size={24}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/');
            }
          }}
          style={styles.icon}
        />
      ) : null}

      <View
        style={{
          flex: 1,
          paddingHorizontal: 4,
        }}
      >
        {typeof title === 'string' ? (
          <Text style={styles.title}>
            {title}
          </Text>
        ) : (title)}
      </View>

      {menuItems.map((item, index) => (
        <MaterialIcons
          key={`icon-${index}`}
          name={item.icon}
          color="#000"
          size={24}
          onPress={item.onPress}
          style={styles.icon}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    padding: 12,
  },
});
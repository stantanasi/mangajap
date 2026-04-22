import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
  title?: string | React.ReactElement;
  canGoBack?: boolean;
  menuItems?: {
    icon: React.ComponentProps<typeof MaterialIcons>['name'];
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
  const navigation = useNavigation();

  return (
    <View style={[styles.container, style]}>
      {canGoBack ? (
        <MaterialIcons
          name="arrow-back"
          color="#000"
          size={24}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else if (typeof window !== 'undefined') {
              window.history.back();
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
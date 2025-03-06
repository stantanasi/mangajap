import { StaticScreenProps } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';

type Props = StaticScreenProps<{}>;

export default function ProfileScreen({ route }: Props) {
  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
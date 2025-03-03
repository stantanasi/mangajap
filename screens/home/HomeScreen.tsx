import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';

type Props = StaticScreenProps<{}>;

export default function HomeScreen({ route }: Props) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
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
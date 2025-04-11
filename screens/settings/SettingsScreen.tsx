import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../contexts/AuthContext';

type Props = StaticScreenProps<{}>;

export default function SettingsScreen({ }: Props) {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 16,
        }}
      >
        <Text
          onPress={() => {
            logout()
              .then(() => navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
              }))
              .catch((err) => console.error(err));
          }}
          style={{
            alignSelf: 'center',
            backgroundColor: '#000',
            borderRadius: 360,
            color: '#fff',
            fontWeight: 'bold',
            marginHorizontal: 16,
            paddingHorizontal: 12,
            paddingVertical: 4,
          }}
        >
          Déconnexion
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../contexts/AuthContext';

type Props = StaticScreenProps<undefined>;

export default function SettingsScreen({ }: Props) {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 16,
        }}
      >
        <View
          style={{
            alignItems: 'flex-start',
            flexDirection: 'row',
          }}
        >
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
            style={{
              padding: 12,
            }}
          />
        </View>

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

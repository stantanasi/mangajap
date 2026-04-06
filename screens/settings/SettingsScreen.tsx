import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { toast } from 'sonner';
import Header from '../../components/molecules/Header';
import { useAuth } from '../../contexts/AuthContext';

type Props = StaticScreenProps<undefined>;

export default function SettingsScreen({ }: Props) {
  const navigation = useNavigation();
  const { logout } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Paramètres"
      />

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
              .catch((err) => {
                console.error(err);
                toast.error("Échec de la déconnexion", {
                  description: err.message || "Une erreur inattendue s'est produite",
                });
              });
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

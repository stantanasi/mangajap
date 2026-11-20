import { MaterialIcons } from '@expo/vector-icons';
import { StackActions, StaticScreenProps, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = StaticScreenProps<undefined>;

export default function NotFoundScreen({ route }: Props) {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          maxWidth: 420,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: 'rgba(212, 14, 14, 0.1)',
            borderRadius: 360,
            flexDirection: 'row',
            gap: 8,
            marginBottom: 20,
            paddingHorizontal: 16,
            paddingVertical: 10,
          }}
        >
          <MaterialIcons
            name="explore"
            size={32}
            color="#d40e0e"
          />

          <Text
            style={{
              color: '#d40e0e',
              fontSize: 22,
              fontWeight: 'bold',
            }}
          >
            404
          </Text>
        </View>

        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 10,
            textAlign: 'center',
          }}
        >
          Page introuvable
        </Text>

        <Text
          style={{
            fontSize: 15,
            marginBottom: 24,
            textAlign: 'center',
          }}
        >
          Oups ! La page que tu recherches n'existe pas, a été déplacée ou l'URL est incorrecte.
        </Text>

        <Pressable
          onPress={() => navigation.dispatch(StackActions.replace('Main'))}
          style={{
            width: '100%',
            alignItems: 'center',
            backgroundColor: "#d40e0e",
            borderRadius: 12,
            flexDirection: 'row',
            gap: 8,
            justifyContent: 'center',
            paddingHorizontal: 20,
            paddingVertical: 14,
          }}
        >
          <MaterialIcons
            name="home"
            size={18}
            color="#fff"
          />

          <Text
            style={{
              color: '#fff',
              fontSize: 15,
              fontWeight: 'bold',
            }}
          >
            Retour à l'accueil
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});

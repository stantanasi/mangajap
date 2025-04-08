import React, { useContext, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';

type Props = {
  onNavigateToRegister: () => void;
};

export default function LoginScreen({ onNavigateToRegister }: Props) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogging, setIsLogging] = useState(false);

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 26,
          fontWeight: 'bold',
          marginBottom: 40,
        }}
      >
        Connexion à MangaJap
      </Text>

      <View style={{ gap: 10 }}>
        <TextInput
          value={email}
          onChangeText={(value) => setEmail(value)}
          placeholder="Email"
          placeholderTextColor="#666"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          value={password}
          onChangeText={(value) => setPassword(value)}
          placeholder="Mot de passe"
          placeholderTextColor="#666"
          secureTextEntry
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      <Pressable
        disabled={isLogging}
        onPress={() => {
          setIsLogging(true)

          login(email, password)
            .catch((err) => console.error(err))
            .finally(() => setIsLogging(false))
        }}
        style={styles.button}
      >
        <Text
          style={{
            color: '#000',
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          Se connecter
        </Text>
        <ActivityIndicator
          animating={isLogging}
          color="#000"
        />
      </Pressable>

      <Text
        onPress={() => onNavigateToRegister()}
        style={{
          color: '#444',
          marginTop: 30,
          textAlign: 'center',
        }}
      >
        Toujours pas inscrit ? Rejoignez-nous !
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  input: {
    borderColor: '#ccc',
    borderRadius: 4,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    alignItems: 'center',
    borderColor: '#000',
    borderRadius: 360,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 60,
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
});

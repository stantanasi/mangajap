import React, { useContext, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';

type Props = {
  onNavigateToLogin: () => void;
};

export default function RegisterScreen({ onNavigateToLogin }: Props) {
  const { register } = useContext(AuthContext);
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 26,
          fontWeight: 'bold',
          marginBottom: 40,
        }}
      >
        Inscription à MangaJap
      </Text>

      <View style={{ gap: 10 }}>
        <TextInput
          value={pseudo}
          onChangeText={(value) => setPseudo(value)}
          placeholder="Pseudo"
          placeholderTextColor="#666"
          style={styles.input}
        />

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
        disabled={isRegistering}
        onPress={() => {
          setIsRegistering(true)

          register(pseudo, email, password)
            .catch((err) => console.error(err))
            .finally(() => setIsRegistering(false))
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
          Inscription
        </Text>
        <ActivityIndicator
          animating={isRegistering}
          color="#000"
        />
      </Pressable>

      <Text
        onPress={() => onNavigateToLogin()}
        style={{
          color: '#444',
          marginTop: 30,
          textAlign: 'center',
        }}
      >
        Déjà inscrit ? Connectez-nous !
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

import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  onNavigateToLogin: () => void;
};

export default function RegisterScreen({ onNavigateToLogin }: Props) {
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
});

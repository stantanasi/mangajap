import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../../contexts/AuthContext';

type Props = {
  onNavigateToRegister: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function LoginScreen({ onNavigateToRegister, style }: Props) {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [isLogging, setIsLogging] = useState(false);

  return (
    <SafeAreaView style={[styles.container, style]}>
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

        <View style={[styles.input, { flexDirection: 'row' }]}>
          <TextInput
            value={password}
            onChangeText={(value) => setPassword(value)}
            placeholder="Mot de passe"
            placeholderTextColor="#666"
            secureTextEntry={hidePassword}
            autoCapitalize="none"
            style={{
              flex: 1,
              padding: 0,
            }}
          />
          <MaterialIcons
            name={hidePassword ? 'visibility-off' : 'visibility'}
            size={24}
            color="black"
            onPress={() => setHidePassword((prev) => !prev)}
          />
        </View>
      </View>

      <Pressable
        disabled={isLogging}
        onPress={() => {
          setIsLogging(true)

          login(email, password)
            .then(() => navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            }))
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
        {isLogging && (
          <ActivityIndicator
            animating
            color="#000"
          />
        )}
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
    </SafeAreaView>
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

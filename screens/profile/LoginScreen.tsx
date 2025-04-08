import React, { useContext, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';

const LoginModal = ({ visible, onRequestClose }: {
  visible: boolean
  onRequestClose: () => void
}) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogging, setIsLogging] = useState(false);

  return (
    <Modal
      animationType="fade"
      onRequestClose={() => onRequestClose()}
      transparent
      visible={visible}
    >
      <Pressable
        onPress={() => onRequestClose()}
        style={{
          backgroundColor: '#00000052',
          flex: 1,
          justifyContent: 'flex-end',
        }}
      >
        <Pressable
          style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          <Text
            style={{
              fontSize: 26,
              fontWeight: 'bold',
              paddingHorizontal: 16,
              marginTop: 16,
              textAlign: 'center',
            }}
          >
            Me connecter
          </Text>

          <TextInput
            value={email}
            onChangeText={(value) => setEmail(value)}
            placeholder="Email"
            placeholderTextColor="#a1a1a1"
            keyboardType='email-address'
            autoCapitalize="none"
            style={{
              borderColor: '#EAEDE8',
              borderRadius: 4,
              borderWidth: 1,
              marginTop: 24,
              marginHorizontal: 20,
              paddingHorizontal: 6,
              paddingVertical: 8,
            }}
          />

          <TextInput
            value={password}
            onChangeText={(value) => setPassword(value)}
            placeholder="Mot de passe"
            placeholderTextColor="#a1a1a1"
            secureTextEntry
            autoCapitalize="none"
            style={{
              borderColor: '#EAEDE8',
              borderRadius: 4,
              borderWidth: 1,
              marginTop: 24,
              marginHorizontal: 20,
              paddingHorizontal: 6,
              paddingVertical: 8,
            }}
          />

          <Pressable
            onPress={() => {
              setIsLogging(true)

              login(email, password)
                .then(() => onRequestClose())
                .catch((err) => console.error(err))
                .finally(() => setIsLogging(false))
            }}
            style={{
              alignItems: 'center',
              backgroundColor: '#000',
              borderRadius: 10,
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 12,
              marginHorizontal: 20,
              marginVertical: 24,
              padding: 16,
            }}
          >
            <Text
              disabled={isLogging}
              style={{
                color: '#fff',
                fontWeight: 'bold',
              }}
            >
              Se connecter
            </Text>
            <ActivityIndicator
              animating={isLogging}
              color="#fff"
            />
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal >
  )
}

type Props = {};

export default function LoginScreen({ }: Props) {
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);

  return (
    <View
      style={{
        alignItems: 'center',
        flex: 1,
        gap: 20,
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 20,
        }}
      >
        Vous n'êtes pas connecté
      </Text>

      <Text
        onPress={() => setLoginModalVisible(true)}
        style={{
          backgroundColor: '#000',
          borderColor: '#000',
          borderRadius: 360,
          borderWidth: 1,
          color: '#fff',
          paddingHorizontal: 12,
          paddingVertical: 4,
        }}
      >
        Connexion
      </Text>

      <LoginModal
        visible={isLoginModalVisible}
        onRequestClose={() => setLoginModalVisible(false)}
      />
    </View>
  );
}

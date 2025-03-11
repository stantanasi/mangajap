import { StaticScreenProps } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../contexts/AuthContext';
import { User } from '../../models';

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


type Props = StaticScreenProps<{
  id?: string;
}>;

export default function ProfileScreen({ route }: Props) {
  const { user: authenticatedUser, logout } = useContext(AuthContext);
  const [user, setUser] = useState<User>();
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);

  const id = route.params?.id ?? authenticatedUser?.id;

  useEffect(() => {
    if (!id) return

    User.findById(id)
      .then((user) => setUser(user));
  }, [id]);

  if (!id) {
    return (
      <SafeAreaView
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
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator
          animating
          color="#000"
          size="large"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          fontSize: 24,
          marginTop: 24,
          textAlign: 'center',
        }}
      >
        {user.pseudo}
      </Text>

      <Text
        onPress={() => logout()}
        style={{
          alignSelf: 'center',
          backgroundColor: '#000',
          borderColor: '#000',
          borderRadius: 360,
          borderWidth: 1,
          color: '#fff',
          marginTop: 20,
          paddingHorizontal: 12,
          paddingVertical: 4,
          textAlign: 'center',
        }}
      >
        Se déconnecter
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
});
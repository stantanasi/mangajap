import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Alert from '../../components/atoms/Alert';
import Header from '../../components/molecules/Header';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../models';
import notify from '../../utils/notify';
import SettingRow from './components/SettingRow';

type Props = StaticScreenProps<undefined>;

export default function SettingsScreen({ }: Props) {
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const [showDelete, setShowDelete] = useState(false);

  const sections: {
    title?: string;
    data: React.ComponentProps<typeof SettingRow>[];
  }[] = [
      {
        title: 'Compte',
        data: [
          {
            label: 'Se déconnecter',
            icon: 'logout',
            danger: true,
            onPress: () => {
              logout()
                .then(() => navigation.reset({
                  index: 0,
                  routes: [{ name: 'Main' }],
                }))
                .catch((err) => notify.error('auth_logout', err));
            },
          },
          {
            label: 'Supprimer votre compte MangaJap',
            subtitle: 'Vos données seront supprimées',
            icon: 'delete',
            danger: true,
            onPress: () => setShowDelete(true),
          },
        ],
      },
    ];

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Paramètres"
      />

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.label}
        renderSectionHeader={({ section }) => (
          <Text
            style={{
              color: '#d40e0e',
              fontSize: 12,
              fontWeight: 'bold',
              marginBottom: 8,
              marginHorizontal: 16,
              marginTop: 16,
              textTransform: 'uppercase',
            }}
          >
            {section.title}
          </Text>
        )}
        renderItem={({ item }) => (
          <SettingRow
            {...item}
            style={{
              marginHorizontal: 16,
            }}
          />
        )}
        SectionSeparatorComponent={() => <View style={{ height: 16 }} />}
        ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
      />

      <Alert
        title="Supprimer le compte"
        message="Cette action est irréversible. Toutes vos données seront supprimées."
        buttons={[
          {
            text: 'Annuler',
            style: 'cancel',
          },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: () => {
              if (!user) return;

              User.findById(user.id)
                .then((user) => user.delete())
                .then(() => logout())
                .then(() => navigation.reset({
                  index: 0,
                  routes: [{ name: 'Main' }],
                }))
                .catch((err) => notify.error('user_delete', err));
            },
          },
        ]}
        visible={showDelete}
        onRequestClose={() => setShowDelete(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

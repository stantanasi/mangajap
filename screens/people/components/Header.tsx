import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import BaseHeader from '../../../components/molecules/Header';
import { useApp } from '../../../contexts/AppContext';
import { useAuth } from '../../../contexts/AuthContext';
import { People } from '../../../models';

type Props = {
  isLoading: boolean;
  people: People;
};

export default function Header({ isLoading, people }: Props) {
  const navigation = useNavigation();
  const { isOffline } = useApp();
  const { user } = useAuth();

  return (
    <BaseHeader
      title={people.name}
      menuItems={!isOffline && !isLoading && user ? [
        {
          icon: 'edit',
          onPress: () => navigation.navigate('PeopleUpdate', { peopleId: people.id }),
        },
      ] : []}
      style={styles.container}
    >
      <Image
        source={{ uri: people.portrait ?? undefined }}
        style={styles.image}
      />

      <Text style={styles.name}>
        {people.name}
      </Text>
    </BaseHeader>
  );
}

const styles = StyleSheet.create({
  container: {},
  image: {
    width: 180,
    alignSelf: 'center',
    aspectRatio: 1 / 1,
    backgroundColor: '#ccc',
    borderRadius: 360,
    marginHorizontal: 16,
  },
  name: {
    color: '#000',
    fontSize: 26,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});

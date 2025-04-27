import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import AutoHeightImage from '../../../components/atoms/AutoHeightImage';
import Modal from '../../../components/atoms/Modal';
import { AuthContext } from '../../../contexts/AuthContext';
import { Chapter } from '../../../models';

type Props = {
  chapter: Chapter | undefined;
  onRequestClose: () => void;
  visible: boolean;
}

export default function ChapterModal({ chapter, onRequestClose, visible }: Props) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  if (!chapter) {
    return (
      <Modal
        onRequestClose={onRequestClose}
        visible={visible}
        position="flex-start"
        style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}
      >
        <ActivityIndicator
          animating
          color="#000"
          size="small"
        />
      </Modal>
    );
  }

  return (
    <Modal
      onRequestClose={onRequestClose}
      visible={visible}
      position="flex-start"
      style={styles.container}
    >
      <View
        style={{
          alignItems: 'flex-start',
          flexDirection: 'row',
        }}
      >
        <MaterialIcons
          name="close"
          color="#000"
          size={24}
          onPress={onRequestClose}
          style={{
            padding: 12,
          }}
        />

        <View style={{ flex: 1 }} />

        {user && user.isAdmin ? (
          <MaterialIcons
            name="edit"
            color="#000"
            size={24}
            onPress={() => {
              navigation.navigate('ChapterUpdate', { chapterId: chapter.id });
              onRequestClose();
            }}
            style={{
              padding: 12,
            }}
          />
        ) : null}
      </View>

      <AutoHeightImage
        source={{ uri: chapter.cover ?? undefined }}
        style={styles.cover}
      />

      <Text style={styles.number}>
        Chapitre {chapter.number}
      </Text>

      <Text style={styles.title}>
        {chapter.title}
      </Text>

      <View
        style={{
          alignItems: 'center',
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
          borderTopColor: '#ccc',
          borderTopWidth: 1,
          flexDirection: 'row',
          padding: 12,
        }}
      >
        <MaterialIcons
          name="calendar-month"
          color={styles.date.color}
          size={20}
          style={{
            marginRight: 4,
          }}
        />
        <Text style={styles.date}>
          {chapter.publishedDate?.toLocaleDateString() ?? 'Indisponible'}
        </Text>

        <View style={{ flex: 1 }} />

        <MaterialIcons
          name="visibility"
          color={styles.date.color}
          size={20}
          style={{
            marginRight: 4,
          }}
        />
        <Text style={styles.date}>
          {chapter['chapter-entry']?.readDate.toLocaleDateString() ?? 'Pas vu'}
        </Text>
      </View>

      <Text style={styles.overview}>
        {chapter.overview || 'Synopsis non disponible'}
      </Text>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: '5%',
    minHeight: 100,
  },
  cover: {
    width: 150,
    alignSelf: 'center',
    marginHorizontal: 12,
  },
  number: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 12,
    marginTop: 20,
    textAlign: 'center',
  },
  title: {
    color: '#888',
    fontSize: 16,
    marginBottom: 12,
    marginHorizontal: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  date: {
    color: '#666',
  },
  overview: {
    margin: 12,
  },
});

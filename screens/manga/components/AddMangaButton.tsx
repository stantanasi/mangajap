import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { AuthContext } from '../../../contexts/AuthContext';
import { Manga, MangaEntry, User } from '../../../models';

type Props = {
  manga: Manga;
  onMangaChange: (manga: Manga) => void;
}

export default function AddMangaButton({ manga, onMangaChange }: Props) {
  const { user } = useContext(AuthContext);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) return null;

  const addMangaEntry = async () => {
    if (manga['manga-entry']) {
      const mangaEntry = manga['manga-entry'].copy({
        isAdd: true,
      });
      await mangaEntry.save();

      onMangaChange(manga.copy({
        'manga-entry': mangaEntry,
      }));
    } else {
      const mangaEntry = new MangaEntry({
        isAdd: true,

        user: new User({ id: user.id }),
        manga: manga,
      });
      await mangaEntry.save();

      onMangaChange(manga.copy({
        'manga-entry': mangaEntry,
      }));
    }
  };

  return (
    <Pressable
      disabled={isUpdating}
      onPress={() => {
        setIsUpdating(true);

        addMangaEntry()
          .catch((err) => console.error(err))
          .finally(() => setIsUpdating(false));
      }}
      style={styles.container}
    >
      {!isUpdating ? (
        <MaterialIcons
          name="add"
          color="#fff"
          size={24}
        />
      ) : (
        <ActivityIndicator
          animating
          color="#fff"
          size={24}
        />
      )}

      <Text style={styles.label}>
        Ajouter le manga
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#4281f5',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

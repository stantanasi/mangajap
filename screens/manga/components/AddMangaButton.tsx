import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { AuthContext } from '../../../contexts/AuthContext';
import { Manga, MangaEntry, User } from '../../../models';
import { useAppDispatch } from '../../../redux/store';

type Props = {
  manga: Manga;
}

export default function AddMangaButton({ manga }: Props) {
  const dispatch = useAppDispatch();
  const { user } = useContext(AuthContext);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) return null;

  const addMangaEntry = async () => {
    if (manga['manga-entry']) {
      manga['manga-entry'].isAdd = true;
      await manga['manga-entry'].save();

      MangaEntry.redux.sync(dispatch, manga['manga-entry'], {
        user: new User({ id: user.id }),
        manga: manga,
      });
    } else {
      const mangaEntry = new MangaEntry({
        isAdd: true,

        user: new User({ id: user.id }),
        manga: manga,
      });
      await mangaEntry.save();

      MangaEntry.redux.sync(dispatch, mangaEntry, {
        user: new User({ id: user.id }),
        manga: manga,
      });
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

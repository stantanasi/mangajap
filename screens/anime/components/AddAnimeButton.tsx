import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { AuthContext } from '../../../contexts/AuthContext';
import { Anime, AnimeEntry, User } from '../../../models';
import { useAppDispatch } from '../../../redux/store';

type Props = {
  anime: Anime;
}

export default function AddAnimeButton({ anime }: Props) {
  const dispatch = useAppDispatch();
  const { user } = useContext(AuthContext);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) return null;

  const addAnimeEntry = async () => {
    if (anime['anime-entry']) {
      anime['anime-entry'].isAdd = true;
      await anime['anime-entry'].save();

      AnimeEntry.redux.sync(dispatch, anime['anime-entry'], {
        user: new User({ id: user.id }),
        anime: anime,
      });
    } else {
      const animeEntry = new AnimeEntry({
        isAdd: true,

        user: new User({ id: user.id }),
        anime: anime,
      });
      await animeEntry.save();

      AnimeEntry.redux.sync(dispatch, animeEntry, {
        user: new User({ id: user.id }),
        anime: anime,
      });
    }
  };

  return (
    <Pressable
      onPress={() => {
        setIsUpdating(true);

        addAnimeEntry()
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
        Ajouter l'animé
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

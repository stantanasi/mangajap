import React, { useContext, useState } from 'react';
import { Image, Pressable, PressableProps, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Anime, AnimeEntry, User } from '../../models';
import Checkbox from '../atoms/Checkbox';

type Props = PressableProps & {
  anime: Anime;
  onAnimeChange?: (anime: Anime) => void;
  style?: StyleProp<ViewStyle>;
}

export default function AnimeSearchCard({
  anime,
  onAnimeChange = () => { },
  style,
  ...props
}: Props) {
  const { user } = useContext(AuthContext);
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <Pressable
      {...props}
      style={[styles.container, style]}
    >
      <Image
        source={{ uri: anime.poster ?? undefined }}
        resizeMode="cover"
        style={styles.image}
      />

      <View style={{ flex: 1, padding: 10 }}>
        <Text
          numberOfLines={2}
          style={styles.title}
        >
          {anime.title}
        </Text>
      </View>

      {user ? (
        <Checkbox
          value={anime['anime-entry']?.isAdd ?? false}
          onValueChange={(value) => {
            setIsUpdating(true);

            const updateAnimeEntry = async () => {
              if (anime['anime-entry']) {
                const animeEntry = anime['anime-entry'].copy({
                  isAdd: value,
                });
                await animeEntry.save();

                onAnimeChange(anime.copy({
                  'anime-entry': animeEntry,
                }));
              } else {
                const animeEntry = new AnimeEntry({
                  isAdd: value,

                  user: new User({ id: user.id }),
                  anime: anime,
                });
                await animeEntry.save();

                onAnimeChange(anime.copy({
                  'anime-entry': animeEntry,
                }));
              }
            };

            updateAnimeEntry()
              .catch((err) => console.error(err))
              .finally(() => setIsUpdating(false));
          }}
          loading={isUpdating}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  image: {
    width: 80,
    aspectRatio: 2 / 3,
    backgroundColor: '#ccc',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

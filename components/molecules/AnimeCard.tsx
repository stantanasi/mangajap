import React, { useContext, useState } from 'react';
import { Image, Pressable, PressableProps, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Anime, AnimeEntry, User } from '../../models';
import Checkbox from '../atoms/Checkbox';

type Props = PressableProps & {
  screen: 'discover' | 'library' | 'profile';
  anime: Anime;
  onAnimeChange?: (anime: Anime) => void;
  style?: ViewStyle;
}

export default function AnimeCard({
  screen,
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
      <View>
        <Image
          source={{ uri: anime.poster ?? undefined }}
          resizeMode="cover"
          style={styles.image}
        />

        {user && screen !== 'library' && screen !== 'profile' ? (
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
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              margin: 4,
            }}
          />
        ) : null}
      </View>

      <Text
        numberOfLines={2}
        style={styles.title}
      >
        {anime.title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 130,
  },
  image: {
    width: '100%',
    aspectRatio: 2 / 3,
    backgroundColor: '#ccc',
  },
  title: {
    textAlign: 'center',
  },
});

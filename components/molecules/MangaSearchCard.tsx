import React, { useContext, useState } from 'react';
import { Image, Pressable, PressableProps, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Manga, MangaEntry, User } from '../../models';
import Checkbox from '../atoms/Checkbox';

type Props = PressableProps & {
  manga: Manga;
  onMangaChange?: (manga: Manga) => void;
  style?: ViewStyle;
}

export default function MangaSearchCard({
  manga,
  onMangaChange = () => { },
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
        source={{ uri: manga.poster ?? undefined }}
        resizeMode="cover"
        style={styles.image}
      />

      <View style={{ flex: 1, padding: 10 }}>
        <Text
          numberOfLines={2}
          style={styles.title}
        >
          {manga.title}
        </Text>
      </View>

      {user ? (
        <Checkbox
          value={manga['manga-entry']?.isAdd ?? false}
          onValueChange={(value) => {
            setIsUpdating(true);

            const updateMangaEntry = async () => {
              if (manga['manga-entry']) {
                const mangaEntry = manga['manga-entry'].copy({
                  isAdd: value,
                });
                await mangaEntry.save();

                onMangaChange(manga.copy({
                  'manga-entry': mangaEntry,
                }));
              } else {
                const mangaEntry = new MangaEntry({
                  isAdd: value,

                  user: new User({ id: user.id }),
                  manga: manga,
                });
                await mangaEntry.save();

                onMangaChange(manga.copy({
                  'manga-entry': mangaEntry,
                }));
              }
            };

            updateMangaEntry()
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

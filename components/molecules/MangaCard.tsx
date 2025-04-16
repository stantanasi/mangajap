import React, { useContext, useState } from 'react';
import { Image, Pressable, PressableProps, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Manga, MangaEntry, User } from '../../models';
import Checkbox from '../atoms/Checkbox';

type Props = PressableProps & {
  screen: 'discover' | 'library' | 'profile';
  manga: Manga;
  onMangaChange?: (manga: Manga) => void;
  style?: ViewStyle;
}

export default function MangaCard({
  screen,
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
      <View>
        <Image
          source={{ uri: manga.poster ?? undefined }}
          resizeMode="cover"
          style={styles.image}
        />

        {user && screen !== 'library' && screen !== 'profile' ? (
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
        {manga.title}
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

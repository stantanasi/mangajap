import React, { useContext, useState } from 'react';
import { Image, ImageStyle, Pressable, PressableProps, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Anime, AnimeEntry, User } from '../../models';
import Checkbox from '../atoms/Checkbox';

type Variants = 'default' | 'horizontal';

type Props = PressableProps & {
  anime: Anime;
  onAnimeChange?: (anime: Anime) => void;
  showCheckbox?: boolean;
  variant?: Variants;
  style?: StyleProp<ViewStyle>;
};

export default function AnimeCard({
  anime,
  onAnimeChange = () => { },
  showCheckbox = true,
  variant = 'default',
  style,
  ...props
}: Props) {
  const { user } = useContext(AuthContext);
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <Pressable
      {...props}
      style={[styles.container, styles[variant].container, style]}
    >
      <Image
        source={{ uri: anime.poster ?? undefined }}
        resizeMode="cover"
        style={[styles.image, styles[variant].image]}
      />

      <View style={[styles.infos, styles[variant].infos]}>
        <Text
          numberOfLines={2}
          style={[styles.title, styles[variant].title, [{}]]}
        >
          {anime.title}
        </Text>
      </View>

      {user && showCheckbox ? (
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
          style={[styles.checkbox, styles[variant].checkbox]}
        />
      ) : null}
    </Pressable>
  );
}

type Style = {
  container: ViewStyle;
  image: ImageStyle;
  infos: ViewStyle;
  title: TextStyle;
  checkbox: ViewStyle;
};

const styles: Style & Record<Variants, Style> = {
  ...StyleSheet.create<Style>({
    container: {},
    image: {
      aspectRatio: 2 / 3,
      backgroundColor: '#ccc',
    },
    infos: {},
    title: {},
    checkbox: {},
  }),

  default: StyleSheet.create<Style>({
    container: {
      width: 130,
    },
    image: {
      width: '100%',
    },
    infos: {},
    title: {
      textAlign: 'center',
    },
    checkbox: {
      position: 'absolute',
      top: 0,
      right: 0,
      margin: 4,
    },
  }),

  horizontal: StyleSheet.create<Style>({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    image: {
      width: 80,
    },
    infos: {
      flex: 1,
      padding: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    checkbox: {},
  }),
};

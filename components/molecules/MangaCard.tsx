import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useContext, useState } from 'react';
import { Image, ImageStyle, Pressable, PressableProps, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Franchise, Manga, MangaEntry, User } from '../../models';
import Checkbox from '../atoms/Checkbox';

type Variants = 'default' | 'horizontal';

type Props = PressableProps & {
  manga: Manga;
  onMangaChange?: (manga: Manga) => void;
  franchise?: Franchise;
  showCheckbox?: boolean;
  variant?: Variants;
  editable?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function MangaCard({
  manga,
  onMangaChange = () => { },
  franchise,
  showCheckbox = true,
  variant = 'default',
  editable = false,
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
      <View
        style={{
          width: styles[variant].image.width ?? styles.image.width,
          height: styles[variant].image.height ?? styles.image.height,
        }}
      >
        <Image
          source={{ uri: manga.poster ?? undefined }}
          resizeMode="cover"
          style={[styles.image, styles[variant].image]}
        />

        {editable ? (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              top: 0,
              alignItems: 'center',
              backgroundColor: '#00000080',
              borderRadius: styles.image.borderRadius,
              justifyContent: 'center',
            }}
          >
            <MaterialIcons
              name="edit"
              color="#fff"
              size={24}
            />
          </View>
        ) : null}
      </View>

      <View style={[styles.infos, styles[variant].infos]}>
        <Text
          numberOfLines={2}
          style={[styles.title, styles[variant].title, [{}]]}
        >
          {manga.title}
        </Text>

        {franchise ? (
          <Text style={[styles.role, styles[variant].role]}>
            {(() => {
              const roleLabels: Record<typeof franchise.role, string> = {
                adaptation: 'Adaptation',
                alternative_setting: 'Univers alternatif',
                alternative_version: 'Version alternative',
                character: 'Personnage',
                full_story: 'Histoire complète',
                other: 'Autre',
                parent_story: 'Histoire principale',
                prequel: 'Préquelle',
                sequel: 'Suite',
                side_story: 'Histoire parallèle',
                spinoff: 'Spin-off',
                summary: 'Résumé',
              };

              return roleLabels[franchise.role];
            })()}
          </Text>
        ) : null}
      </View>

      {user && showCheckbox ? (
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
  role: TextStyle;
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
    role: {},
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
    role: {
      color: '#888',
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
    role: {},
    checkbox: {},
  }),
};

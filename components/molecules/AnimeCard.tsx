import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useContext, useState } from 'react';
import { Image, Pressable, PressableProps, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Anime, AnimeEntry, Franchise, User } from '../../models';
import { FranchiseRole } from '../../models/franchise.model';
import { useAppDispatch } from '../../redux/store';
import Checkbox from '../atoms/Checkbox';

type Variants = 'default' | 'horizontal';

type Props = PressableProps & {
  anime: Anime;
  onAnimeChange?: (anime: Anime) => void;
  franchise?: Franchise;
  showCheckbox?: boolean;
  variant?: Variants;
  editable?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function AnimeCard({
  anime,
  onAnimeChange = () => { },
  franchise,
  showCheckbox = true,
  variant = 'default',
  editable = false,
  style,
  ...props
}: Props) {
  const dispatch = useAppDispatch();
  const { user } = useContext(AuthContext);
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <Pressable
      {...props}
      style={[styles.base.container, styles[variant].container, style]}
    >
      <View style={[styles.base.imageContainer, styles[variant].imageContainer]}>
        <Image
          source={{ uri: anime.poster ?? undefined }}
          resizeMode="cover"
          style={[styles.base.image, styles[variant].image]}
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

      <View style={[styles.base.infos, styles[variant].infos]}>
        <Text
          numberOfLines={2}
          style={[styles.base.title, styles[variant].title, [{}]]}
        >
          {anime.title}
        </Text>

        {variant === 'horizontal' ? (
          <>
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: 4 }}>
              <MaterialIcons
                name="tv"
                color="#000"
                size={20}
              />

              <Text>
                Animé
              </Text>
            </View>

            {anime.startDate ? (
              <Text>
                {anime.startDate.getFullYear()}
              </Text>
            ) : null}
          </>
        ) : null}

        {franchise ? (
          <Text style={[styles.base.role, styles[variant].role]}>
            {FranchiseRole[franchise.role]}
          </Text>
        ) : null}
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

                dispatch(AnimeEntry.redux.actions.setOne(animeEntry));
                dispatch(AnimeEntry.redux.actions.relations.anime.set(animeEntry.id, anime));
                dispatch(value
                  ? User.redux.actions.relations['anime-library'].add(user.id, animeEntry)
                  : User.redux.actions.relations['anime-library'].remove(user.id, animeEntry)
                );

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

                dispatch(AnimeEntry.redux.actions.setOne(animeEntry));
                dispatch(AnimeEntry.redux.actions.relations.anime.set(animeEntry.id, anime));
                dispatch(Anime.redux.actions.relations['anime-entry'].set(anime.id, animeEntry));
                dispatch(value
                  ? User.redux.actions.relations['anime-library'].add(user.id, animeEntry)
                  : User.redux.actions.relations['anime-library'].remove(user.id, animeEntry)
                );

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
          style={[styles.base.checkbox, styles[variant].checkbox]}
        />
      ) : null}
    </Pressable>
  );
}

const styles = {
  base: StyleSheet.create({
    container: {},
    imageContainer: {
      aspectRatio: 2 / 3,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
      backgroundColor: '#ccc',
    },
    infos: {},
    title: {},
    role: {},
    checkbox: {},
  }),

  default: StyleSheet.create({
    container: {
      width: 130,
    },
    imageContainer: {
      width: '100%',
    },
    image: {},
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

  horizontal: StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    imageContainer: {
      width: 80,
    },
    image: {},
    infos: {
      flex: 1,
      gap: 3,
      padding: 10,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    role: {},
    checkbox: {},
  }),
} satisfies Record<'base' | Variants, Record<string, any>>;

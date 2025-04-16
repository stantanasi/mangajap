import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, Image, Pressable, PressableProps, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Anime, AnimeEntry, User } from '../../models';

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

  const isAdd = anime['anime-entry']?.isAdd ?? false;

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

        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            margin: 4,
          }}
        >
          {user && screen !== 'library' && screen !== 'profile' ? (
            <View
              style={{
                backgroundColor: !isAdd ? '#e5e5e5' : '#4281f5',
                borderRadius: 360,
                padding: 8,
              }}
            >
              {!isUpdating ? (
                <MaterialIcons
                  name="check"
                  size={20}
                  color={!isAdd ? '#7e7e7e' : '#fff'}
                  onPress={() => {
                    setIsUpdating(true);

                    const updateAnimeEntry = async () => {
                      if (anime['anime-entry']) {
                        const animeEntry = anime['anime-entry'].copy({
                          isAdd: !isAdd,
                        });
                        await animeEntry.save();

                        onAnimeChange(anime.copy({
                          'anime-entry': animeEntry,
                        }));
                      } else {
                        const animeEntry = new AnimeEntry({
                          isAdd: !isAdd,

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
                />
              ) : (
                <ActivityIndicator
                  animating
                  color="#fff"
                  size={20}
                />
              )}
            </View>
          ) : null}
        </View>
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

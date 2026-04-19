import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import AnimeCard from '../../../components/molecules/AnimeCard';
import { User } from '../../../models';

type Props = {
  isLoading: boolean;
  user: User;
  style?: StyleProp<ViewStyle>;
};

export default function AnimeTab({ isLoading, user, style }: Props) {
  const navigation = useNavigation();

  return (
    <View style={[styles.container, style]}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 6,
          marginHorizontal: 16,
          marginTop: 20,
        }}
      >
        Statistiques
      </Text>

      <FlatList
        horizontal
        data={[
          { label: 'Animé suivis', value: user.followedAnimeCount },
          { label: 'Épisodes vus', value: user.episodesWatch },
          { label: 'Manga suivis', value: user.followedMangaCount },
        ]}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <View
            style={{
              minWidth: 200,
              alignItems: 'center',
              borderColor: '#ccc',
              borderRadius: 4,
              borderWidth: 1,
              gap: 6,
              paddingHorizontal: 16,
              paddingVertical: 6,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: 'bold',
                marginHorizontal: 10,
              }}
            >
              {item.label}
            </Text>

            <View style={{ width: '100%', height: 1, backgroundColor: '#ccc' }} />

            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                marginHorizontal: 10,
              }}
            >
              {item.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
        ListHeaderComponent={() => <View style={{ width: 16 }} />}
        ListFooterComponent={() => <View style={{ width: 16 }} />}
      />

      <Pressable
        onPress={() => navigation.navigate('ProfileLibrary', { type: 'anime-library', userId: user.id })}
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          marginBottom: 6,
          marginHorizontal: 16,
          marginTop: 20,
        }}
      >
        <Text
          style={{
            flex: 1,
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          Anime
        </Text>

        <MaterialIcons
          name="keyboard-arrow-right"
          size={24}
          color="#000"
        />
      </Pressable>

      <FlatList
        horizontal
        data={user['anime-library']?.map((entry) => entry.anime?.copy({
          'anime-entry': entry,
        })).filter((anime) => !!anime)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AnimeCard
            isLoading={isLoading}
            anime={item}
            onPress={() => navigation.navigate('Anime', { id: item.id })}
            showCheckbox={false}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
        ListHeaderComponent={() => <View style={{ width: 16 }} />}
        ListFooterComponent={() => <View style={{ width: 16 }} />}
      />

      {(user['anime-favorites']?.length ?? 0) > 0 ? (
        <>
          <Pressable
            onPress={() => navigation.navigate('ProfileLibrary', { type: 'anime-favorites', userId: user.id })}
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              marginBottom: 6,
              marginHorizontal: 16,
              marginTop: 20,
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: 20,
                fontWeight: 'bold',
              }}
            >
              Anime préférés
            </Text>

            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="#000"
            />
          </Pressable>

          <FlatList
            horizontal
            data={user['anime-favorites']?.map((entry) => entry.anime?.copy({
              'anime-entry': entry,
            })).filter((anime) => !!anime)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <AnimeCard
                isLoading={isLoading}
                anime={item}
                onPress={() => navigation.navigate('Anime', { id: item.id })}
                showCheckbox={false}
              />
            )}
            ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
            ListHeaderComponent={() => <View style={{ width: 16 }} />}
            ListFooterComponent={() => <View style={{ width: 16 }} />}
          />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

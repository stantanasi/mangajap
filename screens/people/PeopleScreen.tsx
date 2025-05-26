import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimeCard from '../../components/molecules/AnimeCard';
import MangaCard from '../../components/molecules/MangaCard';
import { Anime, People } from '../../models';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import Header from './components/Header';

type Props = StaticScreenProps<{
  id: string;
}>;

export default function PeopleScreen({ route }: Props) {
  const navigation = useNavigation();
  const { isLoading, people } = usePeople(route.params);

  if (isLoading || !people) {
    return (
      <SafeAreaView style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator
          animating
          color="#000"
          size="large"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={people.staff!.map((staff) => {
          if (staff.anime) {
            return staff.anime;
          } else if (staff.manga) {
            return staff.manga;
          }
          return null;
        }).filter((media) => !!media)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          item instanceof Anime ? (
            <AnimeCard
              anime={item}
              onPress={() => navigation.navigate('Anime', { id: item.id })}
              variant="horizontal"
              showCheckbox={false}
              style={{
                marginHorizontal: 16,
              }}
            />
          ) : (
            <MangaCard
              manga={item}
              onPress={() => navigation.navigate('Manga', { id: item.id })}
              variant="horizontal"
              showCheckbox={false}
              style={{
                marginHorizontal: 16,
              }}
            />
          )
        )}
        ListHeaderComponent={() => (
          <Header
            people={people}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


const usePeople = (params: Props['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const people = useAppSelector((state) => {
    return People.redux.selectors.selectById(state, params.id, {
      include: {
        staff: {
          include: {
            anime: true,
            manga: true,
          },
        },
      },
    });
  });

  useEffect(() => {
    const prepare = async () => {
      const people = await People.findById(params.id)
        .include({
          staff: {
            anime: true,
            manga: true,
          },
        });

      dispatch(People.redux.actions.setOne(people));
    };

    setIsLoading(true);
    prepare()
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [params]);

  return { isLoading, people };
};

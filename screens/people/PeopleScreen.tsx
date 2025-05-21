import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimeCard from '../../components/molecules/AnimeCard';
import MangaCard from '../../components/molecules/MangaCard';
import { AuthContext } from '../../contexts/AuthContext';
import { Anime, People } from '../../models';
import { useAppDispatch, useAppSelector } from '../../redux/store';

const Header = ({ people }: { people: People }) => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  return (
    <View style={styles.header}>
      <View
        style={{
          alignItems: 'flex-start',
          flexDirection: 'row',
        }}
      >
        <MaterialIcons
          name="arrow-back"
          color="#000"
          size={24}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else if (typeof window !== 'undefined') {
              window.history.back();
            }
          }}
          style={{
            padding: 12,
          }}
        />

        <Text
          style={{
            flex: 1,
            fontSize: 18,
            fontWeight: 'bold',
            padding: 12,
          }}
        >
          {people.name}
        </Text>

        {user && user.isAdmin ? (
          <MaterialIcons
            name="edit"
            color="#000"
            size={24}
            onPress={() => navigation.navigate('PeopleUpdate', { peopleId: people.id })}
            style={{
              padding: 12,
            }}
          />
        ) : null}
      </View>

      <Image
        source={{ uri: people.portrait ?? undefined }}
        style={styles.image}
      />

      <Text style={styles.name}>
        {people.name}
      </Text>
    </View>
  );
};


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
  header: {
    marginBottom: 20,
  },
  image: {
    width: 180,
    alignSelf: 'center',
    aspectRatio: 1 / 1,
    backgroundColor: '#ccc',
    borderRadius: 360,
    marginHorizontal: 16,
  },
  name: {
    color: '#000',
    fontSize: 26,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
    textAlign: 'center',
  },
});


const usePeople = (params: Props['route']['params']) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const people = useAppSelector(People.redux.selectors.selectById(params.id, {
    include: {
      staff: {
        include: {
          anime: true,
          manga: true,
        },
      },
    },
  }));

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

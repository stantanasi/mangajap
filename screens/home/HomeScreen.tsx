import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MangaCard from '../../components/molecules/MangaCard';
import { Manga } from '../../models';

type Props = StaticScreenProps<{}>;

export default function HomeScreen({ route }: Props) {
  const navigation = useNavigation();
  const [mangas, setMangas] = useState<Manga[]>();

  useEffect(() => {
    Manga.find()
      .sort({
        createdAt: 'desc',
      })
      .then((mangas) => setMangas(mangas));
  }, []);

  if (!mangas) {
    return (
      <SafeAreaView
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
        }}
      >
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
        horizontal
        data={mangas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MangaCard
            manga={item}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        ListHeaderComponent={() => <View style={{ width: 16 }} />}
        ListFooterComponent={() => <View style={{ width: 16 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
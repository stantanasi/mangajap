import { StaticScreenProps } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../contexts/AuthContext';
import { Manga, User } from '../../models';

type Props = StaticScreenProps<{}>;

export default function AgendaMangaScreen({ }: Props) {
  const { user } = useContext(AuthContext);
  const [mangas, setMangas] = useState<Manga[]>();

  useEffect(() => {
    const prepare = async () => {
      setMangas(undefined);

      if (user) {
        const mangaLibrary = await User.findById(user.id).get('manga-library')
          .include(['manga'])
          .sort({ updatedAt: 'desc' })
          .limit(500);

        const mangas = mangaLibrary
          .filter((entry) => {
            const progress = (entry.chaptersRead / entry.manga!.chapterCount) * 100;
            return progress < 100;
          })
          .map((entry) => entry.manga!.copy({
            'manga-entry': entry,
          }));

        setMangas(mangas);
      }
    };

    prepare()
      .catch((err) => console.error(err));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
});

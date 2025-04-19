import { StaticScreenProps, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chapter, Manga } from '../../models';
import { IChapter } from '../../models/chapter.model';

type Props = StaticScreenProps<{
  mangaId: string;
} | {
  chapterId: string;
}>

export default function ChapterSaveScreen({ route }: Props) {
  const navigation = useNavigation();
  const [chapter, setChapter] = useState<Chapter>();
  const [form, setForm] = useState<Partial<IChapter>>();

  useEffect(() => {
    const prepare = async () => {
      let chapter = new Chapter();

      if ('mangaId' in route.params) {
        chapter = new Chapter({
          manga: new Manga({ id: route.params.mangaId }),
        });
      } else {
        chapter = await Chapter.findById(route.params.chapterId);
      }

      setChapter(chapter);
      setForm(chapter.toObject());
    };

    const unsubscribe = navigation.addListener('focus', () => {
      prepare()
        .catch((err) => console.error(err));
    });

    return unsubscribe;
  }, [route.params]);

  return (
    <SafeAreaView style={styles.container}>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

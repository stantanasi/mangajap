import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProgressBar from '../../../components/atoms/ProgressBar';
import TabBar from '../../../components/atoms/TabBar';
import { AuthContext } from '../../../contexts/AuthContext';
import { Manga } from '../../../models';

type Props<T extends string> = {
  manga: Manga;
  tabs: React.ComponentProps<typeof TabBar<T>>['tabs'];
  selectedTab: T;
  onTabSelect: (tab: T) => void;
}

export default function Header<T extends string>({
  manga,
  tabs,
  selectedTab,
  onTabSelect,
}: Props<T>) {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const progress = manga['manga-entry']
    ? manga.chapterCount > 0
      ? (manga['manga-entry'].chaptersRead / manga.chapterCount) * 100
      : (manga['manga-entry'].volumesRead / manga.volumeCount) * 100
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
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
          style={styles.icon}
        />

        <Text style={styles.title}>
          {manga.title}
        </Text>

        {user && user.isAdmin ? (
          <MaterialIcons
            name="edit"
            color="#000"
            size={24}
            onPress={() => navigation.navigate('MangaUpdate', { id: manga.id })}
            style={styles.icon}
          />
        ) : null}
      </View>

      <ProgressBar
        progress={progress}
      />

      <TabBar
        selected={selectedTab}
        tabs={tabs}
        onTabChange={(key) => onTabSelect(key)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  topBar: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  icon: {
    padding: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    padding: 12,
  },
});

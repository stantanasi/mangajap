import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, FlatList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import MangaCard from '../../../components/molecules/MangaCard';
import LoadingScreen from '../../../components/organisms/LoadingScreen';
import { Manga } from '../../../models';

type Props = {
  isLoading: boolean;
  list: Manga[];
  onLoadMore: () => void;
  hasMore: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function MangaTab({ isLoading, list, onLoadMore, hasMore, style }: Props) {
  const navigation = useNavigation();

  if (isLoading) {
    return (
      <LoadingScreen style={[styles.container, style]} />
    );
  }

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MangaCard
            isLoading={isLoading}
            manga={item}
            onPress={() => navigation.navigate('Manga', { id: item.id })}
            variant="horizontal"
            style={{
              marginHorizontal: 16,
            }}
          />
        )}
        ListHeaderComponent={() => <View style={{ height: 16 }} />}
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: '#ccc',
              marginVertical: 8,
            }}
          />
        )}
        ListFooterComponent={() => (
          hasMore ? (
            <View style={{ marginVertical: 12 }}>
              <ActivityIndicator
                animating
                color="#000"
              />
            </View>
          ) : (
            <View style={{ height: 16 }} />
          )
        )}
        keyboardShouldPersistTaps="always"
        onEndReached={() => onLoadMore()}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

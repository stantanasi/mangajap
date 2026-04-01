import React, { useMemo } from 'react';
import { FlatList, FlatListProps, ListRenderItem, ListRenderItemInfo, View } from 'react-native';

type Props<ItemT = any> = Omit<FlatListProps<ItemT>, 'ItemSeparatorComponent' | 'columnWrapperStyle'> & {
  data: ItemT[];
  numColumns: number;
  keyExtractor: ((item: ItemT, index: number) => string);
  renderItem: ListRenderItem<ItemT>;
  contentPadding?: number;
  gap?: number;
};

export default function GridList<ItemT = any>(props: Props<ItemT>) {
  const data: (ItemT | null)[] = useMemo(() => {
    const missing = (props.numColumns - (props.data.length % props.numColumns)) % props.numColumns;

    return [
      ...props.data,
      ...Array(missing).fill(null),
    ];
  }, [props.data, props.numColumns]);

  return (
    <FlatList
      key={props.numColumns}
      data={data}
      numColumns={props.numColumns}
      keyExtractor={(item, index) => item ? props.keyExtractor(item, index) ?? '' : `filler-${index}`}
      renderItem={(info) => (
        <View
          style={{
            flex: 1 / props.numColumns,
            marginHorizontal: props.numColumns === 1 ? props.contentPadding : 0,
          }}
        >
          {info.item
            ? props.renderItem(info as ListRenderItemInfo<ItemT>)
            : undefined}
        </View>
      )}
      ItemSeparatorComponent={() => <View style={{ height: props.gap }} />}
      ListHeaderComponent={props.ListHeaderComponent}
      ListFooterComponent={props.ListFooterComponent}
      columnWrapperStyle={props.numColumns > 1 ? {
        gap: props.gap,
        paddingHorizontal: props.contentPadding,
      } : undefined}
    />
  );
}

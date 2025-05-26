import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, Pressable, View } from 'react-native';
import SearchBar from '../../../components/atoms/SearchBar';
import PeopleCard from '../../../components/molecules/PeopleCard';
import { People } from '../../../models';
import { useAppDispatch, useAppSelector } from '../../../redux/store';

type Props = {
  onSelect: (people: People) => void;
  onRequestClose: () => void;
  visible: boolean;
}

export default function SelectPeopleModal({ onSelect, onRequestClose, visible }: Props) {
  const dispatch = useAppDispatch();
  const [peopleIds, setPeopleIds] = useState<string[]>();

  const peoples = useAppSelector((state) => {
    if (!peopleIds) return [];
    return People.redux.selectors.selectByIds(state, peopleIds);
  });

  useEffect(() => {
    setPeopleIds(undefined);
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onRequestClose}
      transparent
      visible={visible}
    >
      <Pressable
        onPress={onRequestClose}
        style={{
          alignItems: 'center',
          backgroundColor: '#00000052',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <Pressable
          style={{
            width: '90%',
            height: '90%',
            backgroundColor: '#fff',
            borderRadius: 4,
            gap: 12,
          }}
        >
          <SearchBar
            onChangeText={() => {
              setPeopleIds(undefined);
            }}
            onSearch={(query) => {
              setPeopleIds(undefined);

              People.find({ query: query })
                .then((peoples) => {
                  dispatch(People.redux.actions.setMany(peoples));
                  setPeopleIds(peoples.map((people) => people.id));
                })
                .catch((err) => console.error(err));
            }}
            delay={500}
            style={{
              backgroundColor: undefined,
              borderColor: '#ccc',
              borderRadius: 4,
              borderWidth: 1,
              marginHorizontal: 16,
              marginTop: 16,
            }}
          />

          {!peoples ? (
            <ActivityIndicator
              animating
              color="#000"
              size="large"
            />
          ) : (
            <FlatList
              data={peoples}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <PeopleCard
                  people={item}
                  onPress={() => onSelect(item)}
                  variant="horizontal"
                  style={{
                    marginHorizontal: 16,
                  }}
                />
              )}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              keyboardShouldPersistTaps="always"
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

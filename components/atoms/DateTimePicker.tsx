import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Modal from './Modal';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const YEARS = Array.from({ length: 2101 - 1900 }, (_, k) => 1900 + k);

type Props = {
  value: Date;
  onValueChange?: (value: Date) => void;
  onRequestClose: () => void;
  visible: boolean;
}

export default function DateTimePicker({
  value,
  onValueChange = () => { },
  onRequestClose,
  visible,
}: Props) {
  const [display, setDisplay] = useState<'calendar' | 'input' | 'year'>('calendar');
  const [activeDate, setActiveDate] = useState<Date>(value);
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setActiveDate(value);
    setSelectedDate(value);
    setInputValue(value.toLocaleDateString());
  }, [value]);

  useEffect(() => {
    setDisplay('calendar');
  }, [visible]);

  const days: Date[] = (() => {
    const month = activeDate.getMonth();
    const year = activeDate.getFullYear();

    return Array.from(
      { length: new Date(year, month + 1, 0).getDate() },
      (_, i) => new Date(year, month, i + 1)
    );
  })();

  const weeks: (Date | null)[][] = (() => {
    const startDay = (days[0].getDay() + 6) % 7;

    const allDays: (Date | null)[] = [
      ...Array.from({ length: startDay }, () => null),
      ...days,
    ];

    return Array.from(
      { length: 6 },
      (_, i) => {
        const week = allDays.slice(i * 7, i * 7 + 7);
        return [
          ...week,
          ...Array.from({ length: 7 - week.length }, () => null),
        ];
      }
    );
  })();

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  };

  return (
    <Modal
      onRequestClose={onRequestClose}
      visible={visible}
      style={styles.container}
    >
      <Text>
        Sélectionner une date
      </Text>

      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 26,
        }}
      >
        <Text style={styles.selectedDate}>
          {selectedDate?.toLocaleDateString() ?? 'Date sélectionnée'}
        </Text>

        <MaterialIcons
          name={display === 'calendar' || display === 'year' ? 'edit' : 'calendar-month'}
          color="#000"
          size={24}
          onPress={() => setDisplay(display === 'calendar' || display === 'year' ? 'input' : 'calendar')}
        />
      </View>

      {display === 'input' ? (
        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 12 }}>
            Date
          </Text>

          <TextInput
            autoFocus
            value={inputValue}
            onChangeText={(text) => {
              setInputValue(text);

              const [day, month, year] = text.match(/^\d{2}\/\d{2}\/\d{4}$/)?.[0].split('/').map(Number) ?? [];
              const parsed = new Date(year, month - 1, day);

              if (!isNaN(parsed.getTime())) {
                setSelectedDate(parsed);
              } else {
                setSelectedDate(null);
              }
            }}
            placeholder="jj/mm/aaaa"
            placeholderTextColor="#666"
            inputMode="numeric"
            style={{
              paddingVertical: 10,
            }}
          />
        </View>
      ) : (
        <View style={{ flex: 1, marginTop: 16 }}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <Pressable
              onPress={() => setDisplay(display === 'calendar' ? 'year' : 'calendar')}
              style={{
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <Text>
                {MONTHS[activeDate.getMonth()]} {activeDate.getFullYear()}
              </Text>

              <MaterialIcons
                name={display === 'calendar' ? 'arrow-drop-down' : 'arrow-drop-up'}
                color="#000"
                size={24}
              />
            </Pressable>

            {display === 'calendar' ? (
              <View
                style={{
                  flexDirection: 'row',
                  gap: 20,
                }}
              >
                <MaterialIcons
                  name="keyboard-arrow-left"
                  color="#000"
                  size={24}
                  onPress={() => setActiveDate((prev) => {
                    const date = new Date(prev);
                    date.setMonth(date.getMonth() - 1);
                    return date;
                  })}
                />

                <MaterialIcons
                  name="keyboard-arrow-right"
                  color="#000"
                  size={24}
                  onPress={() => setActiveDate((prev) => {
                    const date = new Date(prev);
                    date.setMonth(date.getMonth() + 1);
                    return date;
                  })}
                />
              </View>
            ) : null}
          </View>

          {display === 'year' ? (
            <FlatList
              data={YEARS}
              keyExtractor={(year) => year.toString()}
              renderItem={({ item: year }) => {
                const isActive = activeDate.getFullYear() === year;

                return (
                  <Pressable
                    onPress={() => {
                      setActiveDate((prev) => {
                        const date = new Date(prev);
                        date.setFullYear(year);
                        return date;
                      });
                      setDisplay('calendar');
                    }}
                    style={[styles.year, isActive ? {
                      backgroundColor: '#4281f5',
                      borderRadius: 360,
                    } : {}]}
                  >
                    <Text style={[isActive ? { color: '#fff' } : {}]}>
                      {year}
                    </Text>
                  </Pressable>
                );
              }}
              numColumns={3}
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              initialScrollIndex={Math.floor(YEARS.indexOf(activeDate.getFullYear()) / 3)}
              getItemLayout={(_, index) => {
                const height = 54; // 44 + 10 (approx. height + separator)
                return {
                  length: height,
                  offset: height * index,
                  index: index,
                };
              }}
            />
          ) : (
            <View style={styles.calendar}>
              <View style={styles.week}>
                {DAYS.map((day) => (
                  <View
                    key={day}
                    style={styles.day}
                  >
                    <Text>
                      {day.substring(0, 1)}
                    </Text>
                  </View>
                ))}
              </View>

              {weeks.map((week, i) => (
                <View
                  key={i}
                  style={styles.week}
                >
                  {week.map((day, j) => {
                    if (day === null) {
                      return (
                        <View
                          key={j}
                          style={styles.day}
                        />
                      );
                    }

                    const isToday = isSameDay(new Date(), day);
                    const isSelected = selectedDate ? isSameDay(selectedDate, day) : false;

                    return (
                      <Pressable
                        key={j}
                        onPress={() => setSelectedDate(day)}
                        style={[styles.day, isToday ? {
                          borderColor: '#4281f5',
                          borderRadius: 360,
                          borderWidth: 1,
                        } : {}, isSelected ? {
                          backgroundColor: '#4281f5',
                          borderRadius: 360,
                        } : {}]}
                      >
                        <Text style={[isToday ? { color: '#4281f5' } : {}, isSelected ? { color: '#fff' } : {}]}>
                          {day.getDate()}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      <View
        style={{
          flexDirection: 'row',
          gap: 24,
          justifyContent: 'flex-end',
          marginTop: 10,
        }}
      >
        <Text
          onPress={() => onRequestClose()}
          style={{
            color: '#4281f5'
          }}
        >
          Annuler
        </Text>

        <Text
          onPress={() => {
            if (!selectedDate) return

            const date = new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              value.getHours(),
              value.getMinutes(),
              value.getSeconds(),
              value.getMilliseconds()
            );

            onValueChange(date);
            onRequestClose();
          }}
          style={{
            color: '#4281f5'
          }}
        >
          OK
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  selectedDate: {
    fontSize: 26,
  },
  calendar: {},
  week: {
    flexDirection: 'row',
  },
  day: {
    alignItems: 'center',
    aspectRatio: 1 / 1,
    color: '#000',
    flex: 1,
    justifyContent: 'center',
    margin: 2,
  },
  years: {
    marginHorizontal: 10,
  },
  year: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10,
    padding: 10,
  },
});

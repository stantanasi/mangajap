import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';

const TabContext = createContext<{
  tabs: string[];
  selected: number;
  setSelected: (index: number) => void;
}>({
  tabs: [],
  selected: 0,
  setSelected: () => { },
});


const Container = ({ children, header, style }: {
  children?: React.ReactElement<typeof Tab>[] | React.ReactElement<typeof Tab>;
  header?: () => React.ReactElement | null;
  style?: StyleProp<ViewStyle>;
}) => {
  const tabs = useMemo(() => {
    if (Array.isArray(children)) {
      return children.map((child) => child);
    } else if (children) {
      return [children];
    } else {
      return [];
    }
  }, [children]);
  const [selected, setSelected] = useState(0);

  return (
    <TabContext.Provider
      value={{
        tabs: tabs.map((tab) => tab.props.name),
        selected: selected,
        setSelected: setSelected,
      }}
    >
      <View style={[{ flex: 1 }, style]}>
        {header ? header() : <Bar />}

        {tabs.map((tab, index) => (
          <View
            key={tab.props.name}
            style={{
              display: selected === index ? 'flex' : 'none',
              flex: 1,
            }}
          >
            {tab}
          </View>
        ))}
      </View>
    </TabContext.Provider>
  );
};


const Bar = ({ style }: {
  style?: StyleProp<ViewStyle>;
}) => {
  const { tabs, selected, setSelected } = useContext(TabContext);

  return (
    <View style={[{ flexDirection: 'row' }, style]}>
      {tabs.map((tab, index) => (
        <Pressable
          key={tab}
          onPress={() => setSelected(index)}
          style={{
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Text
            style={{
              color: selected === index ? '#000' : '#888',
              fontWeight: 'bold',
              padding: 10,
              textTransform: 'uppercase',
            }}
          >
            {tab}
          </Text>

          <View
            style={{
              width: '100%',
              height: 4,
              backgroundColor: selected === index ? '#d40e0e' : '',
            }}
          />
        </Pressable>
      ))}
    </View>
  );
};


const Tab = ({ children, name, style }: PropsWithChildren & {
  name: string;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View style={[{ flex: 1 }, style]}>
      {children}
    </View>
  );
};


const Tabs = {
  Container,
  Bar,
  Tab,
};
export default Tabs;

import React, { createContext, useContext, useMemo, useState } from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';

const TabContext = createContext<{
  tabs: { name: string; label: string; }[];
  focusedTab: string;
  onTabChange: (name: string) => void;
}>({
  tabs: [],
  focusedTab: '',
  onTabChange: () => { },
});


const Container = ({ children, header, style }: {
  children?: React.ReactElement<typeof Tab>[] | React.ReactElement<typeof Tab>;
  header?: () => React.ReactElement | null;
  style?: StyleProp<ViewStyle>;
}) => {
  const tabs = useMemo(() => {
    const tabs = Array.isArray(children) ? children
      : children ? [children]
        : [];

    return tabs.map((tab) => {
      const props: React.ComponentProps<typeof Tab> = tab.props;
      return {
        name: props.name,
        label: props.label ?? props.name,
        children: tab,
      };
    });
  }, [children]);

  const [focusedTab, setFocusedTab] = useState(tabs[0]?.name);

  return (
    <TabContext.Provider
      value={{
        tabs,
        focusedTab,
        onTabChange: setFocusedTab,
      }}
    >
      <View style={[{ flex: 1 }, style]}>
        {header ? header() : <Bar />}

        {tabs.map((tab) => (
          <View
            key={tab.name}
            style={{
              display: tab.name === focusedTab ? 'flex' : 'none',
              flex: 1,
            }}
          >
            {tab.children}
          </View>
        ))}
      </View>
    </TabContext.Provider>
  );
};


const Bar = ({ style }: {
  style?: StyleProp<ViewStyle>;
}) => {
  const { tabs, focusedTab, onTabChange } = useContext(TabContext);

  return (
    <View
      style={[{
        flexDirection: 'row',
      }, style]}
    >
      {tabs.map((tab) => (
        <Pressable
          key={tab.name}
          onPress={() => onTabChange(tab.name)}
          style={{
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Text
            style={{
              color: tab.name === focusedTab ? '#000' : '#888',
              fontWeight: 'bold',
              padding: 10,
              textTransform: 'uppercase',
            }}
          >
            {tab.label}
          </Text>

          <View
            style={{
              width: '100%',
              height: 4,
              backgroundColor: tab.name === focusedTab ? '#d40e0e' : 'transparent',
            }}
          />
        </Pressable>
      ))}
    </View>
  );
};


const Tab = ({ children }: React.PropsWithChildren & {
  name: string;
  label?: string;
}) => {
  return <>{children}</>;
};


const Tabs = {
  Container,
  Bar,
  Tab,
};
export default Tabs;

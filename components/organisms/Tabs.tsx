import React, { createContext, useMemo, useState } from 'react';
import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native';
import TopBar from '../atoms/TopBar';
import Header from '../molecules/Header';

const TabContext = createContext<{
  tabs: { name: string; label: string; }[];
  focusedTab: string;
}>({
  tabs: [],
  focusedTab: '',
});


const Container = ({
  children,
  title,
  canGoBack = true,
  menuItems = [],
  TopBarComponent = TopBar,
  TabBarComponent = Bar,
  style,
}: React.ComponentProps<typeof TopBar> & {
  children?: React.ReactElement<typeof Tab>[] | React.ReactElement<typeof Tab>;
  TopBarComponent?: React.ComponentType<React.ComponentProps<typeof TopBar>>;
  TabBarComponent?: React.ComponentType<React.ComponentProps<typeof Bar>>;
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
      }}
    >
      <View style={[{ flex: 1 }, style]}>
        <Header
          title={title}
          canGoBack={canGoBack}
          menuItems={menuItems}
          TopBarComponent={(props) => <TopBarComponent {...props} />}
        >
          <TabBarComponent
            tabs={tabs}
            focusedTab={focusedTab}
            onTabChange={setFocusedTab}
          />
        </Header>

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


const Bar = ({ tabs, focusedTab, onTabChange, style }: {
  tabs: { name: string; label: string; }[];
  focusedTab: string;
  onTabChange: (name: string) => void;
  style?: StyleProp<ViewStyle>;
}) => {
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

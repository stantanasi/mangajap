import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FlatListProps, LayoutChangeEvent, Pressable, SectionList as RNSectionList, ScrollViewProps, SectionListProps, StyleProp, Text, View, ViewStyle } from 'react-native';
import Animated, { AnimatedRef, Extrapolation, interpolate, scrollTo, SharedValue, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { scheduleOnUI } from 'react-native-worklets';
import TopBar from '../atoms/TopBar';
import Header from '../molecules/Header';

interface IContainerContext {
  tabs: { name: string; label: string; }[];
  focusedTab: string;
  refs: React.RefObject<Record<string, AnimatedRef<Animated.ScrollView | Animated.FlatList | typeof AnimatedSectionList>>>;
  setRef: <T extends Animated.ScrollView | Animated.FlatList | typeof AnimatedSectionList>(name: string, ref: AnimatedRef<T>) => void;
  containerHeight: number;
  headerHeight: number;
  topBarHeight: number;
  collapsibleHeight: number;
  tabBarHeight: number;
  headerTranslateY: SharedValue<number>;
  scrollY: SharedValue<number>;
  scrollsY: SharedValue<Record<string, number>>;
}
const ContainerContext = createContext<IContainerContext | undefined>(undefined);
const useContainerContext = () => {
  const context = useContext(ContainerContext);
  if (!context) throw new Error('useContainerContext must be inside a Tabs.Container');
  return context;
};

interface ITabContext {
  name: string;
}
const TabContext = createContext<ITabContext | undefined>(undefined);
const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) throw new Error('useTabContext must be inside a Tabs.Tab');
  return context;
};


const useLayoutHeight = (initialHeight: number = 0) => {
  const [height, setHeight] = useState(initialHeight);

  const getHeight = useCallback((event: LayoutChangeEvent) => {
    const latestHeight = event.nativeEvent.layout.height;
    if (latestHeight !== height) setHeight(latestHeight);
  }, [height]);

  return [height, getHeight] as const;
};

const useAnimatedRefs = () => {
  const refs: IContainerContext['refs'] = useRef({});

  const setRef = useCallback((name: string, ref: AnimatedRef<Animated.ScrollView | Animated.FlatList | typeof AnimatedSectionList>) => {
    refs.current[name] = ref;
  }, []) as IContainerContext['setRef'];

  return [refs, setRef] as const;
};

const useScrollHandlerY = (name: string) => {
  const { scrollY, scrollsY, headerTranslateY, collapsibleHeight } = useContainerContext();

  const scrollHandler = useAnimatedScrollHandler({
    onBeginDrag: (event, ctx: { prevY: number; }) => {
      ctx.prevY = event.contentOffset.y;
    },
    onScroll: (event, ctx: { prevY: number; }) => {
      const y = event.contentOffset.y;
      const delta = y - ctx.prevY;
      ctx.prevY = y;

      const theoreticalTranslateY = interpolate(
        y,
        [0, collapsibleHeight],
        [0, -collapsibleHeight],
        Extrapolation.CLAMP
      );

      const isInconsistent = Math.abs(headerTranslateY.value - theoreticalTranslateY) > 0.5;

      if (isInconsistent && y > 0) {
        const newTranslate = headerTranslateY.value - delta;
        headerTranslateY.value = Math.min(0, Math.max(newTranslate, -collapsibleHeight));
      } else {
        headerTranslateY.value = theoreticalTranslateY;
      }

      scrollY.value = y;
      scrollsY.value[name] = y;
    },
  });

  return { scrollHandler };
};


function Container({
  children,
  title,
  canGoBack = true,
  menuItems = [],
  TopBarComponent = TopBar,
  CollapsibleComponent,
  TabBarComponent = Bar,
  style,
}: React.ComponentProps<typeof TopBar> & {
  children?: React.ReactElement<typeof Tab>[] | React.ReactElement<typeof Tab>;
  TopBarComponent?: React.ComponentType<React.ComponentProps<typeof TopBar>>;
  CollapsibleComponent?: React.ComponentType<React.ComponentProps<typeof TopBar>>;
  TabBarComponent?: React.ComponentType<React.ComponentProps<typeof Bar>>;
  style?: StyleProp<ViewStyle>;
}) {
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

  const [refs, setRef] = useAnimatedRefs();

  const [containerHeight, getContainerLayoutHeight] = useLayoutHeight();
  const [headerHeight, getHeaderHeight] = useLayoutHeight();
  const [topBarHeight, getTopBarHeight] = useLayoutHeight();
  const [collapsibleHeight, getCollapsibleHeight] = useLayoutHeight();
  const [tabBarHeight, getTabBarHeight] = useLayoutHeight();

  const headerTranslateY = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const scrollsY = useSharedValue<Record<string, number>>({});

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: headerTranslateY.value }]
    };
  });

  const topBarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -headerTranslateY.value }]
    };
  });

  const onTabChange = (name: string) => {
    const currentGlobalScrollY = scrollY.value;
    const maxScroll = Math.max(0, headerHeight - tabBarHeight);

    const lastPosForTarget = scrollsY.value[name] || 0;

    const minRequiredY = currentGlobalScrollY > maxScroll ? maxScroll : currentGlobalScrollY;

    const ref = refs.current[name];
    if (ref) {
      if (lastPosForTarget < minRequiredY) {
        scheduleOnUI(() => {
          'worklet';
          scrollTo(ref, 0, minRequiredY, false);
        });

        scrollsY.value[name] = minRequiredY;
      }
    }

    setFocusedTab(name);
  };

  return (
    <ContainerContext.Provider
      value={{
        tabs,
        focusedTab,
        refs,
        setRef,
        containerHeight,
        headerHeight,
        topBarHeight,
        collapsibleHeight,
        tabBarHeight,
        headerTranslateY,
        scrollY,
        scrollsY,
      }}
    >
      <View
        onLayout={getContainerLayoutHeight}
        style={[{
          flex: 1,
        }, style]}
      >
        <Animated.View
          pointerEvents="box-none"
          onLayout={getHeaderHeight}
          style={[{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
          }, headerStyle]}
        >
          <Header
            TopBarComponent={() => (
              <Animated.View
                onLayout={getTopBarHeight}
                style={[{ zIndex: 2 }, topBarStyle]}
              >
                <TopBarComponent
                  title={title}
                  canGoBack={canGoBack}
                  menuItems={menuItems}
                />
              </Animated.View>
            )}
          >
            <View
              onLayout={getCollapsibleHeight}
              style={{ zIndex: 1 }}
            >
              {CollapsibleComponent && <CollapsibleComponent />}
            </View>

            <Animated.View
              onLayout={getTabBarHeight}
            >
              <TabBarComponent
                tabs={tabs}
                focusedTab={focusedTab}
                onTabChange={onTabChange}
              />
            </Animated.View>
          </Header>
        </Animated.View>

        {tabs.map((tab) => (
          <View
            key={tab.name}
            style={{
              display: tab.name === focusedTab ? 'flex' : 'none',
              flex: 1,
            }}
          >
            <TabContext.Provider
              value={{
                name: tab.name,
              }}
            >
              {tab.children}
            </TabContext.Provider>
          </View>
        ))}
      </View>
    </ContainerContext.Provider>
  );
};


function Bar({ tabs, focusedTab, onTabChange, style }: {
  tabs: { name: string; label: string; }[];
  focusedTab: string;
  onTabChange: (name: string) => void;
  style?: StyleProp<ViewStyle>;
}) {
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


function Tab({ children }: React.PropsWithChildren & {
  name: string;
  label?: string;
}) {
  return <>{children}</>;
};


function ScrollView({
  children,
  ...props
}: ScrollViewProps) {
  const ref = useAnimatedRef<Animated.ScrollView>();
  const { setRef, containerHeight, headerHeight, topBarHeight, tabBarHeight } = useContainerContext();
  const { name } = useTabContext();

  const { scrollHandler } = useScrollHandlerY(name);

  useEffect(() => {
    setRef(name, ref);
  }, [name, ref]);

  return (
    <Animated.ScrollView
      {...props}
      ref={ref}
      onScroll={scrollHandler}
      scrollEventThrottle={1}
    >
      <View style={{ height: headerHeight }} />

      <View style={{ minHeight: containerHeight - topBarHeight - tabBarHeight }}>
        {children}
      </View>
    </Animated.ScrollView>
  );
};


function FlatList<ItemT = any>({
  contentContainerStyle,
  ListHeaderComponent,
  ...props
}: FlatListProps<ItemT>) {
  const ref = useAnimatedRef<Animated.FlatList>();
  const { setRef, containerHeight, headerHeight, topBarHeight, tabBarHeight } = useContainerContext();
  const { name } = useTabContext();

  const { scrollHandler } = useScrollHandlerY(name);

  useEffect(() => {
    setRef(name, ref);
  }, [name, ref]);

  const renderListHeader = () => {
    if (!ListHeaderComponent) return null;

    if (React.isValidElement(ListHeaderComponent)) {
      return ListHeaderComponent;
    }

    const HeaderComp = ListHeaderComponent as React.ComponentType;
    return <HeaderComp />;
  };

  return (
    <Animated.FlatList
      {...props as React.ComponentProps<typeof Animated.FlatList>}
      ref={ref}
      onScroll={scrollHandler}
      scrollEventThrottle={1}
      contentContainerStyle={[contentContainerStyle, { minHeight: containerHeight - topBarHeight - tabBarHeight }]}
      ListHeaderComponent={<>
        <View style={{ height: headerHeight }} />
        {renderListHeader()}
      </>}
    />
  );
};


const AnimatedSectionList = Animated.createAnimatedComponent(RNSectionList);
function SectionList<ItemT = any, SectionT = { [key: string]: any; }>({
  contentContainerStyle,
  ListHeaderComponent,
  ...props
}: SectionListProps<ItemT, SectionT>) {
  const ref = useAnimatedRef<typeof AnimatedSectionList>();
  const { setRef, containerHeight, headerHeight, topBarHeight, tabBarHeight } = useContainerContext();
  const { name } = useTabContext();

  const { scrollHandler } = useScrollHandlerY(name);

  useEffect(() => {
    setRef(name, ref);
  }, [name, ref]);

  const renderListHeader = () => {
    if (!ListHeaderComponent) return null;

    if (React.isValidElement(ListHeaderComponent)) {
      return ListHeaderComponent;
    }

    const HeaderComp = ListHeaderComponent as React.ComponentType;
    return <HeaderComp />;
  };

  return (
    <AnimatedSectionList
      {...props as React.ComponentProps<typeof AnimatedSectionList>}
      ref={ref}
      onScroll={scrollHandler}
      scrollEventThrottle={1}
      contentContainerStyle={[contentContainerStyle, { minHeight: containerHeight - topBarHeight - tabBarHeight }]}
      ListHeaderComponent={<>
        <View style={{ height: headerHeight }} />
        {renderListHeader()}
      </>}
    />
  );
};


const Tabs = {
  Container,
  Bar,
  Tab,
  ScrollView,
  FlatList,
  SectionList,
};
export default Tabs;

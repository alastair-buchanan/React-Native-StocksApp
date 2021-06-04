import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/TabBarIcon";
import StocksScreen from "../screens/StocksScreen";
import SearchScreen from "../screens/SearchScreen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { HomeScreen } from "../screens/HomeScreen";
import { Tab } from "react-native-elements/dist/tab/tab";
import SignOut from "../components/SignOut";
import { View, Text } from "react-native";
import { Button, DataTable } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Search";

export default function BottomTabNavigator({ navigation, route }) {
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerTitle: getHeaderTitle(route),
    });
  }, [navigation, route]);

  function getHeaderTitle() {
    async function handlePress() {
      try {
        AsyncStorage.removeItem("token");
        navigation.navigate("SignInScreen");
      } catch (error) {
        console.log("Error signing out", error);
      }
    }

    return (
      <View >
        <Button mode="contained" onPress={() => handlePress()}>
          Signout
        </Button>
      </View>
    );
  }

  return (
    <BottomTab.Navigator tabBarIcon initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="home" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Stocks"
        component={StocksScreen}
        options={{
          title: "Stocks",
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-trending-up" />
          ),
        }}
      />
      <BottomTab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: "Search",
          headerLeft: () => null,
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="md-search" />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

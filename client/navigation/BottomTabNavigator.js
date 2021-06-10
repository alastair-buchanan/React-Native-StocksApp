import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/TabBarIcon";
import StocksScreen from "../screens/StocksScreen";
import SearchScreen from "../screens/SearchScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { View } from "react-native";
import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Search";

/**
 * This functional component provides the navigation once the user has signed in
 * via a bottom tab with buttons
 */
export default function BottomTabNavigator({ navigation, route }) {
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerTitle: getHeaderTitle(route),
    });
  }, [navigation, route]);

  /**
   * This function handles the press of the Sign out button, it removes the
   * user email and token from async storage and redirects the user to the
   * sign in screen.
   */
  async function handlePress() {
    try {
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("email");
      navigation.navigate("SignInScreen");
    } catch (error) {
      console.log("Error signing out", error);
    }
  }

  /**
   * This function returns the sign out button
   */
  function getHeaderTitle() {
    return (
      <View>
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

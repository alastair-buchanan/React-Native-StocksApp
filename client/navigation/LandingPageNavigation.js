import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/TabBarIcon";
import StocksScreen from "../screens/StocksScreen";
import SearchScreen from "../screens/SearchScreen";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { HomeScreen } from "../screens/HomeScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "SignIn";

export default function LandingPageNavigation({ navigation, route }) {
    useEffect(() => {
      navigation.setOptions({ headerTitle: null });
    }, [navigation, route]);
  
    return (
      <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
        <BottomTab.Screen
          name="SignIn"
          component={SignInScreen}
          options={{
            title: "SignIn",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} name="home" />
            ),
          }}
        />
        <BottomTab.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            title: "SignUp",
            tabBarIcon: ({ focused }) => (
              <TabBarIcon focused={focused} name="md-trending-up" />
            ),
          }}
        />
      </BottomTab.Navigator>
    );
  }
  
  function getHeaderTitle(route) {
    return getFocusedRouteNameFromRoute(route) ?? INITIAL_ROUTE_NAME;
  }
  
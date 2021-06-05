import * as React from "react";
import { Platform, StyleSheet, View, StatusBar } from "react-native";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import { StocksProvider } from "./contexts/StocksContext";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import SplashScreen from "./screens/SplashScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <StocksProvider>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <NavigationContainer theme={DarkTheme}>
          <Stack.Navigator>
            <Stack.Screen
              name="SplashScreen"
              options={{ headerBackTitleVisible: false }}
              component={SplashScreen}
            />
            <Stack.Screen
              name="SignInScreen"
              options={{ headerShown: false }}
              component={SignInScreen}
            />
            <Stack.Screen
              name="SignUpScreen"
              options={{ headerShown: false }}
              component={SignUpScreen}
            />
            <Stack.Screen
              name="BottomTabNavigator"
              options={{ headerBackTitleVisible: false }}
              component={BottomTabNavigator}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </StocksProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

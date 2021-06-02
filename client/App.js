import * as React from "react";
import { Platform, StyleSheet, View, StatusBar } from "react-native";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import { StocksProvider } from "./contexts/StocksContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LandingPageNavigation from "./navigation/LandingPageNavigation";
import { AuthProvider } from "./contexts/AuthContext";



const Stack = createStackNavigator();


export default function App(props) {

  // Set unauthorized handler later

  return (
    <View style={styles.container}>
      <AuthProvider>
        <StocksProvider>
          {Platform.OS === "ios" && <StatusBar barStyle="default" />}
          <NavigationContainer theme={DarkTheme}>
            <Stack.Navigator>
              {state.userToken == null ? (
                <Stack.Screen
                  name="Landing Page"
                  component={LandingPageNavigation}
                />
              ) : (
                <Stack.Screen name="Home" component={BottomTabNavigator} />
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </StocksProvider>
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
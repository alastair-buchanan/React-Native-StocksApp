import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

// fix later, add in loading component in the main body

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    (async () => {
      let userToken = await getToken();
      if (userToken === null) {
        navigation.navigate("SignInScreen");
      } else {
        navigation.navigate("BottomTabNavigator");
      }
    })();
  }, []);
  return (
    <View>
      <Text>Splash screen</Text>
    </View>
  );
}

async function getToken() {
  let token = null;

  try {
    token = await AsyncStorage.getItem("token");
  } catch (error) {
    console.log("error getting token from async");
  }
  console.log("state for auth", token);
  return token;
}

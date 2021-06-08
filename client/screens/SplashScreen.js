import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { scaleSize } from "../components/Utils";

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
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="grey" />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    width: Dimensions.get("window").width,
    justifyContent: "center",
    marginTop: scaleSize(45),
  },
});

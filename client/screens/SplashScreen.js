import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { scaleSize } from "../constants/Utils";


/**
 * This functional component runs on startup, it identifies if there is a current 
 * token stored in async storage and will navigate the user to sign in screen if a token
 * cannot be found, else will bypass sign in and send user to the search screen.
 */
export default function SplashScreen({ navigation }) {

  /**
   * This async function retrieves and returns a user token from async storage.
   * 
   * @returns {string} token
   */
  async function getToken() {
    let token = null;
  
    try {
      token = await AsyncStorage.getItem("token");
    } catch (error) {
      console.log("error getting token from async");
    }
    return token;
  }

  /**
   * This useEffect checks to see if a token is present in async storage and then 
   * redirects the user accordingly.
   */
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

import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Button } from "react-native-paper";

export default function SignOut({ navigation }) {
  async function handlePress() {
    try {
      AsyncStorage.removeItem("token");
      navigation.nagivate("SignInScreen");
    } catch (error) {
      console.log("Error signing out", error);
    }
  }

  return (
    <Button mode="contained" onPress={() => handlePress()}>
      SignOut
    </Button>
  );
}

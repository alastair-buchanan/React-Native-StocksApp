import React from "react";
import { Button, View, Text, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet } from "react-native";
import { scaleSize } from "../components/Utils";

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../assets/images/Logo.png")}
      />
      <Text style={styles.text}>Click on search to add stocks to your watch list</Text>
      <Text style={styles.text}>Select a stock in your watch list to view current and historical price data</Text>
      <Text style={styles.text}>The stock data can be toggled to view either absolute or percentage</Text>
      <Text style={styles.text}>Thank you for choosing IFN666 stocks</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: scaleSize(200),
    height: scaleSize(200),
    resizeMode: "stretch",
  },
  text: {
    color: "white",
    fontSize: scaleSize(15),
    marginTop: scaleSize(15),
    padding: scaleSize(15),
    textAlign: "center",
    width: scaleSize(300),
  },
});

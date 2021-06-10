import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { View, Text } from "react-native";
import { TextInput } from "react-native-paper";
import { scaleSize, USERS_API_URL } from "../constants/Utils";
import { useStocksContext } from "../contexts/StocksContext";

/**
 * This functional component returns a sign in screen with form checking.
 */
export default function SignInScreen({ navigation }) {
  const { setCurrentUserDetails } = useStocksContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * This async function send a post request to the database with user details
   * for sign in. On success the user is navigated to the BottomTabNavigator.
   * On fail, the user is displayed the server response error message.
   * 
   * @param {Object} data 
   */
  async function signIn(data) {
    setErrorMessage("");
    fetch(`${USERS_API_URL}/users/login`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: data.email, password: data.password }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.token !== undefined) {
          setCurrentUserDetails(email, res.token);
          AsyncStorage.setItem("email", data.email);
          AsyncStorage.setItem("token", res.token);
          navigation.navigate("BottomTabNavigator");
        } else {
          setErrorMessage(res.message);
        }
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Welcome to IFN666 Stocks</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        value={password}
        style={styles.textInput}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage.length !== 0 && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
      <TouchableOpacity
        style={styles.button}
        title="Sign in"
        onPress={() => signIn({ email, password })}
      >
        <Text>Sign in</Text>
      </TouchableOpacity>

      <Text style={styles.text}>Don't have an account?</Text>
      <Text
        onPress={() => navigation.navigate("SignUpScreen")}
        style={styles.linkText}
      >
        Sign up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleText: {
    color: "white",
    fontSize: scaleSize(30),
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: scaleSize(30),
  },
  errorText: {
    color: "red",
    fontSize: scaleSize(12),
    paddingTop: scaleSize(10),
  },
  text: {
    color: "white",
    fontSize: scaleSize(20),
    marginTop: scaleSize(20),
    padding: scaleSize(15),
    textAlign: "center",
    width: scaleSize(300),
  },
  textInput: {
    width: scaleSize(300),
    marginTop: scaleSize(20),
  },
  linkText: {
    color: "#acacac",
    fontSize: scaleSize(20),
    fontWeight: "bold",
    textAlign: "center",
    width: scaleSize(300),
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: scaleSize(20),
    elevation: scaleSize(8),
    backgroundColor: "#009688",
    borderRadius: scaleSize(10),
    paddingVertical: scaleSize(10),
    paddingHorizontal: scaleSize(12),
  },
});

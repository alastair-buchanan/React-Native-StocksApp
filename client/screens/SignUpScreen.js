import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useState } from "react";
import { Button, Dimensions, StyleSheet } from "react-native";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TextInput } from "react-native-paper";
import { AuthContext } from "../App";

const API_URL = "http://172.22.26.173:3000";

function scaleSize(fontSize) {
  const window = Dimensions.get("window");
  return Math.round((fontSize / 375) * Math.min(window.width, window.height));
}

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function signUp(data) {
    fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        username: data.userName,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.token !== undefined) {
          AsyncStorage.setItem("token", res.token);
          navigation.navigate("BottomTabNavigator");
        } else {
          //ADD in error handling here later setErrorMessage(res.ssomethingggggggggg)
          console.log("incorrect registration");
        }
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Welcome to IFN666 Stocks</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Username"
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Sign up"
        onPress={() => signUp({ email, userName, password })}
      />
      {errorMessage.length === 0 && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      <Text style={styles.text}>Already have an account?</Text>

      <Text
        onPress={() => navigation.navigate("SignInScreen")}
        style={styles.linkText}
      >
        Sign in
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleText: {
    color: "white",
    fontSize: scaleSize(20),
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: scaleSize(10),
  },
  text: {
    color: "white",
    fontSize: scaleSize(20),
    marginTop: 20,
    padding: 15,
    textAlign: "center",
  },
  linkText: {
    color: "#acacac",
    fontSize: scaleSize(20),
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

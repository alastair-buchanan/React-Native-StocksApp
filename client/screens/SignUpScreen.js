import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Button, Dimensions, StyleSheet } from "react-native";
import { View, Text } from "react-native";
import { TextInput } from "react-native-paper";

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
          console.log("incorrect registration", res);
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
        style={styles.textInput}
        placeholder="Username"
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage.length === 0 && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
      <TouchableOpacity
        style={styles.button}
        title="Sign up"
        onPress={() => signUn({ email, userName, password })}
      >
        <Text>Sign up</Text>
      </TouchableOpacity>

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
    fontSize: scaleSize(30),
    fontWeight: "bold",
    textAlign: "center",
    paddingBottom: scaleSize(30),
  },
  errorText: {
    color: "red",
    fontSize: scaleSize(10),
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
    //width: scaleSize(300),
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

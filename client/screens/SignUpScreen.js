import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { View, Text } from "react-native";
import { TextInput } from "react-native-paper";
import { scaleSize, USERS_API_URL } from "../constants/Utils";

/**
 * This functional component displays a sign up screen to the user with form and
 * error validation, from client and server side.
 */
export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  /**
   * This function is run when the user submits the form. It contains client side
   * form validation and returns a boolean value of form validity.
   * 
   * @param {string} email 
   * @param {string} password 
   * @returns {boolean} isValid
   */
  function validateSignUp(email, password) {
    let isValid = true;
    var emailFormat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var passwordFormat = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    setErrorMessage("");
    setEmailError("");
    setPasswordError("");
    if (email.length === 0 || userName.length === 0 || password.length === 0) {
      setErrorMessage("No fields can be empty");
      isValid = false;
    }
    if (email.match(emailFormat) === null) {
      setEmailError("Email invalid");
      isValid = false;
    }
    if (password.match(passwordFormat) === null) {
      setPasswordError(
        "Password should contain atleast one number and one special character and be atleast 6 characters"
      );
      isValid = false;
    }
    return isValid;
  }


  /**
   * This async function checks the user input both client and server side for
   * validity. If valid user details are stored in the database and async storage
   * and is redirected to the search screen. If the form in invalid, the user is
   * displayed error details.
   * 
   * @param {String} email 
   * @param {String} userName 
   * @param {String} password 
   */
  async function signUp({ email, userName, password }) {
    setEmailError("");
    setPasswordError("");
    const isLoginValid = validateSignUp(
      email,
      password,
      userName
    );
    if (isLoginValid === false) {
      return;
    }
    fetch(`${USERS_API_URL}/users/register`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        username: userName,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.token !== undefined) {
          AsyncStorage.setItem("email", email);
          AsyncStorage.setItem("token", res.token);
          navigation.navigate("BottomTabNavigator");
        } else {
          setErrorMessage(res.Message);
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
      {errorMessage.length !== 0 && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
      {emailError.length !== 0 && (
        <Text style={styles.errorText}>{emailError}</Text>
      )}
      {password.length !== 0 && (
        <Text style={styles.errorText}>{passwordError}</Text>
      )}
      <TouchableOpacity
        style={styles.button}
        title="Sign up"
        onPress={() => signUp({ email, userName, password })}
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

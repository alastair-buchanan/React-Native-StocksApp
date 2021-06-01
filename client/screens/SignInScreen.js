import React, { useContext, useState } from "react";
import { Button } from "react-native";
import { View, Text } from "react-native";
import { TextInput } from "react-native-paper";
import { AuthContext } from "../App";

const USERS_API_URL = "http://localhost:3000";

export default function SignInScreen({ route }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useContext(AuthContext);

  async function getStocksFromDB(email) {
    let res = await fetch(`${USERS_API_URL}/users/${email}/symbols`);
    let data = res.json();
    console.log("retrieved data from db", data);
    return data;
  };

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign in" onPress={() => signIn({ email, password })} />
      <Button title="symbols" onPress={() => getStocksFromDB("tt")} />
    </View>
  );
}

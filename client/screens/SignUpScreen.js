import React, { useContext, useState } from "react";
import { Button } from "react-native";
import { View, Text } from "react-native";
import { TextInput } from "react-native-paper";
import { AuthContext } from "../App";

export default function SignUpScreen({ route }) {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const { signUp } = useContext(AuthContext);

  return (
    <View>
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
        title="Sign in"
        onPress={() => signUp({ email, userName, password })}
      />
    </View>
  );
}

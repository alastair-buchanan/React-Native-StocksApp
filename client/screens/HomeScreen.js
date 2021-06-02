import React from 'react'
import { Button, View, Text } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://172.22.26.173:3000";

export const HomeScreen = () => {
    function register() {
        fetch(`${API_URL}/users/register`, {
            method: "POST",
            headers: { accept: "application/json", "Content-Type": "application/json"},
            body: JSON.stringify({ email: "asdfasdf@email.com", password: "qwer", username: "Katharina2"})
        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
        })
    }

    function login() {
        fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: { accept: "application/json", "Content-Type": "application/json"},
            body: JSON.stringify({ email: "asdfasdf@email.com", password: "qwer", username: "Katharina"})
        })
        .then((res) => res.json())
        .then((res) => {
            AsyncStorage.setItem("token", res.token);
        })
    }

    return (
        <View>
            <Text>Home Screen</Text>
            <Button title="register" onPress={register}/>
            <Button title="login" onPress={login}/>
        </View>
        
    )
}

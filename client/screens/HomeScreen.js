import React from 'react'
import { Button, View, Text } from 'react-native';

const API_URL = "http://localhost:3000";

export const HomeScreen = () => {
    function register() {
        fetch(`${API_URL}/users/register`, {
            method: "POST",
            headers: { accept: "application/json", "Content-Type": "application/json"},
            body: JSON.stringify({ email: "kat@email.com", password: "qwer", username: "Katharina"})
        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
        })
    }

    return (
        <View>
            <Text>Home Screen</Text>
            <Button title="register" onPress={register}/>
        </View>
        
    )
}

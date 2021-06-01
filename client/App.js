import * as React from "react";
import { Platform, StyleSheet, View, StatusBar } from "react-native";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import { StocksProvider } from "./contexts/StocksContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LandingPageNavigation from "./navigation/LandingPageNavigation";
import jwt from "jsonwebtoken";


export const AuthContext = React.createContext();

const Stack = createStackNavigator();
const API_URL = "http://localhost:3000";

export default function App(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [tokenExpiry, setTokenExpiry] = React.useState(Date.now());
  const [unauthorized, setUnauthorized] = React.useState(false);
  // Set unauthorized handler later



  React.useEffect(() => {
    const getToken = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem("token");
        let decodeToken = jwt.decode(userToken)
        let dateNow = new Date();
        let tokenDate = new Date(decodeToken.exp)
        console.log("Decoded User Token date", tokenDate);
        console.log("copmare dates", tokenDate < dateNow);
        if (tokenDate < dateNow) {
          //AsyncStorage.clear();
          userToken = null;
        }
      } catch (err) {
        console.log(err);
      }
      dispatch({ type: "RESTORE_TOKEN", token: userToken });
    };

    getToken();
  }, []);

  const authContext = React.useMemo(() => ({
    signIn: async (data) => {
      fetch(`${API_URL}/users/login`, {
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
            AsyncStorage.setItem("token", res.token);
            dispatch({ type: "SIGN_IN", token: res.token });
          } else {
            //ADD in error handling here later
            console.log("incorrect login", res)
            setUnauthorized(true);
          }
          
        });
    },
    signOut: () => dispatch({ type: "SIGN_OUT" }),
    signUp: async (data) => {
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
            dispatch({ type: "SIGN_IN", token: res.token });
          } else {
            //ADD in error handling here later
            console.log("incorrect registration")
          }
          

          
        });
    },
  }));

  return (
    <View style={styles.container}>
      <AuthContext.Provider value={authContext}>
        <StocksProvider>
          {Platform.OS === "ios" && <StatusBar barStyle="default" />}
          <NavigationContainer theme={DarkTheme}>
            <Stack.Navigator>
              {state.userToken == null ? (
                <Stack.Screen
                  name="Landing Page"
                  component={LandingPageNavigation}
                />
              ) : (
                <Stack.Screen name="Home" component={BottomTabNavigator} />
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </StocksProvider>
      </AuthContext.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const initialState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
};

const reducer = (prevState, action) => {
  switch (action.type) {
    case "RESTORE_TOKEN":
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false,
      };
    case "SIGN_IN":
      return {
        ...prevState,
        isSignout: false,
        userToken: action.token,
      };
    case "SIGN_OUT":
      return {
        ...prevState,
        isSignout: true,
        userToken: null,
      };
  }
};
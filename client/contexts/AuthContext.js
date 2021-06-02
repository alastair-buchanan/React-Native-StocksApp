import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext, useEffect } from "react";
import { StocksProvider } from "./StocksContext";

const AuthContext = React.createContext();

const API_URL = "http://172.22.26.173:3000";

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <AuthContext.Provider value={[state, setState]}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const [state, setState] = useContext(authContext);

  useEffect(() => {
    (async () => {
      let token = null;

      try {
        token = await AsyncStorage.getItem("token");
      } catch (error) {
        console.log(error);
      }
    })();

    setState({
      isLoading: true,
      isSignout: false,
      userToken: token,
    });
  }, []);

  async function signIn(data) {
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
          setState({
            isLoading: false,
            isSignout: false,
            userToken: res.token,
          });
        } else {
          //ADD in error handling here later
          console.log("incorrect login", res);
        }
      });
  }

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
          setState({
            isLoading: false,
            isSignout: false,
            userToken: res.token,
          });
        } else {
          //ADD in error handling here later
          console.log("incorrect registration");
        }
      });
  }

  function signOut() {
    setState({
      isLoading: false,
      isSignout: true,
      userToken: null,
    });
  }

  return {
    ServerURL: "http://131.181.190.87:3001",
    authState: state,
    loading: loading,
    addToWatchlist,
  };
};

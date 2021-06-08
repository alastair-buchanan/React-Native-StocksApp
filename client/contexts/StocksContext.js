import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext, useEffect } from "react";
import { USERS_API_URL } from "../constants/Utils";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentToken, setCurrentToken] = useState("");
  //const [isTokenExpired, setIsTokenExpired] = useState(false);

  // can put more code here
  async function postSymbolsToUser() {
    let token = await AsyncStorage.getItem("token");
    let user = await AsyncStorage.getItem("email");
    let userSymbols = await _retrieveData();
    fetch(`${USERS_API_URL}/users/symbols/update`, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: user,
        symbols: userSymbols,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error === true) {
          AsyncStorage.removeItem("token");
          AsyncStorage.removeItem("email");
          return;
        }
        return;
      });
  }

  async function _retrieveData() {
    try {
      //const keys = AsyncStorage.getItem("symbols");
      const keys = await AsyncStorage.getAllKeys();
      let stocks = keys.filter((value) => value !== "token");
      let newStocks = stocks.filter((value) => value !== "email");
      return newStocks;
    } catch (error) {
      return;
    }
  }

  async function getStocksFromDB() {
    let user = await AsyncStorage.getItem("email");
    if (user === undefined) {
      return;
    }
    let res = await fetch(`${USERS_API_URL}/users/${user}/symbols`);
    let data = await res.json();

    if (data["Symbols"].length > 0) {
      let newArray = [];
      data["Symbols"].map((element) => {
        var isInvalidSymbol = state.includes(element);
        if (isInvalidSymbol === false) {
          AsyncStorage.setItem(element, element);
          newArray.push(element);
        }
      });
      return newArray;
    }
  }

  async function addToWatchlist(newSymbol) {
    var isInvalidSymbol = state.includes(newSymbol);
    if (isInvalidSymbol === false && newSymbol !== undefined) {
      setState([...state, newSymbol]);
      AsyncStorage.setItem(newSymbol, newSymbol);
      const isTokenExpired = await postSymbolsToUser();
      return isTokenExpired;
    }
  }

  function setCurrentUserDetails(email, token) {
    setCurrentUser(email);
    setCurrentToken(token);
  }

  //debug this later
  async function removeSymbol(symbol) {
    let retrievedArray = await _retrieveData();
    let tempList = retrievedArray.filter((element) => element !== symbol);
    await AsyncStorage.removeItem(symbol);
    await postSymbolsToUser(tempList);
    setState(tempList);
  }

  async function initialiseContextState(data) {
    await setState(data);
  }

  return {
    watchList: state,
    addToWatchlist,
    setCurrentUserDetails,
    removeSymbol,
    getStocksFromDB,
    initialiseContextState,
    _retrieveData,
  };
};

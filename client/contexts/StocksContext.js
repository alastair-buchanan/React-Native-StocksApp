import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext, useEffect } from "react";
import { USERS_API_URL } from "../constants/Utils";

const StocksContext = React.createContext();

/**
 * This functions supplies state to its children components 
 */
export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

/**
 * This functional component provides context functions for accessing and
 * and setting the user's symbols from state.
 */
export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentToken, setCurrentToken] = useState("");

  /**
   * This function sends a post request to the database to update the users
   * saved symbols. It checks servers response, and removes the users details
   * from async storage if the users JWT token is expired.
   */
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

  /**
   * This async function retrieves the users symbols from async storage.
   * 
   * @returns {Array}
   */
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

  /**
   * This async function retrieves the users symbols from the Database and 
   * checks them against the symbols already in async storage, if async storage
   * does not contain a symbol it is added.
   * 
   * @returns {Array}
   */
  async function getStocksFromDB() {
    let user = await AsyncStorage.getItem("email");
    if (user === undefined) {
      return;
    }
    let res = await fetch(`${USERS_API_URL}/users/${user}/symbols`);
    let data = await res.json();

    if (data["Symbols"] !== null) {
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
    } else {
      console.log("Error getting stocks from DB");
    }
  }

  /**
   * This function receives a symbol and checks if the symbol is valid, if valid
   * the symbol is added to state and async storage, and updates the Database.
   * 
   * When querying the database, if the token has expired the function returns
   * false.
   * 
   * @param {String} newSymbol 
   * @returns {Boolean} isTokenExpired
   */
  async function addToWatchlist(newSymbol) {
    var isInvalidSymbol = state.includes(newSymbol);
    if (isInvalidSymbol === false && newSymbol !== undefined) {
      setState([...state, newSymbol]);
      AsyncStorage.setItem(newSymbol, newSymbol);
      const isTokenExpired = await postSymbolsToUser();
      return isTokenExpired;
    }
  }

  /**
   * This function sets the current user details of email and token
   * 
   * @param {String} email 
   * @param {String} token 
   */
  function setCurrentUserDetails(email, token) {
    setCurrentUser(email);
    setCurrentToken(token);
  }

  /**
   * This async function removes a symbol from async storage, state, and the 
   * database
   * 
   * @param {String} symbol 
   */
  async function removeSymbol(symbol) {
    let retrievedArray = await _retrieveData();
    let tempList = retrievedArray.filter((element) => element !== symbol);
    await AsyncStorage.removeItem(symbol);
    await postSymbolsToUser(tempList);
    setState(tempList);
  }

  /**
   * This function sets a list of symbols as the state.
   * 
   * @param {Array<String>} data 
   */
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

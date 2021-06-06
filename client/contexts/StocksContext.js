import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext, useEffect } from "react";

const StocksContext = React.createContext();

const AV_API_KEY = "GKRUI3TTPZADU2T7";
//const FMP_API_KEY = "1e866a76e34848836623e16619aadb55";
const FMP_API_KEY = "cbf32ae2c42284acaaf341bcb3c243e9";
//const FMP_API_KEY = "b40776c8f4a497b7699489254b470535";
//const FMP_API_KEY = "78afde332bca5468f9d9cba438c47fb1";
const USERS_API_URL = "http://172.22.26.173:3000";

// async function getStocksByCode(search) {
//   //const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${search}&apikey=${AV_API_KEY}`;
//   const url = `https://financialmodelingprep.com/api/v3/quote/${search}?apikey=${FMP_API_KEY}`;
//   let res = await fetch(url);
//   let data = await res.json();
//   return data;
// }

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
  const [currentList, setCurrentList] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentToken, setCurrentToken] = useState("");
  const [deletedSymbol, setDeletedSymbol] = useState(undefined);

  // can put more code here
  async function postSymbolsToUser() {
    let token = await AsyncStorage.getItem("token");
    let user = await AsyncStorage.getItem("email");
    let userSymbols = await _retrieveData();
    console.log(currentToken);
    fetch(`${USERS_API_URL}/users/symbols/update`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: user,
        symbols: userSymbols,
      }),
    }).then((res) => res.json());
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
      //await AsyncStorage.setItem("symbols", newArray);
      return newArray;
    }
  }

  async function addToWatchlist(newSymbol) {
    //FixMe: add the new symbol to the watchlist, save it in useStockContext state and persist to AsyncStorage
    console.log("state", state);
    var isInvalidSymbol = state.includes(newSymbol);
    if (isInvalidSymbol === false && newSymbol !== undefined) {
      setState([...state, newSymbol]);
      AsyncStorage.setItem(newSymbol, newSymbol);
      postSymbolsToUser()
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
    setCurrentList(tempList);
    await postSymbolsToUser(currentList);
    setState([tempList]);
  }

  async function initialiseContextState(data) {
    await setState(data);
  }

  // useEffect(() => {
  //   (async () => {
  //     let retrievedSymbols = await _retrieveData();
  //     if (retrievedSymbols !== undefined) {
  //       await setState([retrievedSymbols]);
  //     }
  //   })();
  // }, []);

  // useEffect(() => {
  //   if (currentUser === undefined) {
  //     return;
  //   }
  //   getStocksFromDB();
  //   // const userSymbols = returnedData.Symbols;
  //   // //await AsyncStorage.clear()
  //   // if (userSymbols !== null) {
  //   //   userSymbols.map((symbol) => {
  //   //     addToWatchlist(symbol);
  //   //   });
  //   // }
  // }, [currentUser]);

  return {
    watchList: state,
    deleted: deletedSymbol,
    email: currentUser,
    addToWatchlist,
    setCurrentUserDetails,
    removeSymbol,
    getStocksFromDB,
    initialiseContextState,
    _retrieveData,
  };
};

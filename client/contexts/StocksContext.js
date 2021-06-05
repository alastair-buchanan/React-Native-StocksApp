import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext, useEffect } from "react";

const StocksContext = React.createContext();

const AV_API_KEY = "GKRUI3TTPZADU2T7";
//const FMP_API_KEY = "1e866a76e34848836623e16619aadb55";
const FMP_API_KEY = "cbf32ae2c42284acaaf341bcb3c243e9";
//const FMP_API_KEY = "b40776c8f4a497b7699489254b470535";
const USERS_API_URL = "http://172.22.26.173:3000";

async function getStocksByCode(search) {
  //const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${search}&apikey=${AV_API_KEY}`;
  const url = `https://financialmodelingprep.com/api/v3/quote/${search}?apikey=${FMP_API_KEY}`;
  let res = await fetch(url);
  let data = await res.json();
  return data;
}

async function getStocksFromDB(email) {
  let res = await fetch(`${USERS_API_URL}/users/${email}/symbols`);
  let data = res.json();
  console.log("retrieved data from db", data);
  return data;
}

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
  const [loading, setLoading] = useState(false);
  const [isNewLoad, setisNewLoad] = useState(true);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentToken, setCurrentToken] = useState(null);
  const [deletedSymbol, setDeletedSymbol] = useState(undefined);

  // can put more code here
  async function postSymbolsToUser(userSymbols) {
    fetch(`${USERS_API_URL}/users/symbols/update`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify({
        email: currentUser,
        symbols: userSymbols,
      }),
    }).then((res) => res.json());
  }

  let _retrieveData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();

      return keys.filter((value) => value !== "token");
    } catch (error) {
      return;
    }
  };


  async function addToWatchlist(newSymbol) {
    //FixMe: add the new symbol to the watchlist, save it in useStockContext state and persist to AsyncStorage
    console.log("state", state);
    var isInvalidSymbol = currentList.includes(newSymbol);
    if (isInvalidSymbol === false && newSymbol !== undefined) {
      //change this to setCurrentList([...currentList, newSymbol]);
      currentList.push(newSymbol);
      postSymbolsToUser(currentList);

      let symbolInfo = await getStocksByCode(newSymbol);
      setState([...state, symbolInfo[0]]);
      AsyncStorage.setItem(newSymbol, newSymbol);
    }
  }

  async function setCurrentUserDetails(email, token) {
    setCurrentUser(email);
    setCurrentToken(token);
  }

  //debug this later
  async function removeSymbol(symbol) {
    setDeletedSymbol(symbol);
    let tempList = state.filter((element) => element.symbol !== symbol);
    AsyncStorage.removeItem(symbol);
    setCurrentList(tempList);
    //await postSymbolsToUser(currentList);
    setState([tempList]);
  }

  useEffect(() => {
    (async () => {
      if (currentList.length > 0) {
        return;
      }
      let retrievedList = await _retrieveData();
      retrievedList.map((element) => {
        addToWatchlist(element);
      });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (currentUser === undefined) {
        return;
      }
      const returnedData = await getStocksFromDB(currentUser);
      const userSymbols = returnedData.Symbols;
      //await AsyncStorage.clear()
      if (userSymbols !== null) {
        userSymbols.map((symbol) => {
          addToWatchlist(symbol);
        });
      }
    })();
  }, [currentUser]);

  return {
    watchList: state,
    deleted: deletedSymbol,
    addToWatchlist,
    setCurrentUserDetails,
    removeSymbol,
  };
};

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
  const [retrievedStocks, setRetrievedStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNewLoad, setisNewLoad] = useState(true);
  const [currentUser, setCurrentUser] = useState("tt");

  // can put more code here
  async function postSymbolsToUser(userSymbols) {
    fetch(`${USERS_API_URL}/users/symbols/update`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-type": "application/json",
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
      // Error retrieving data
    }
  };

  async function addToWatchlist(newSymbol) {
    //FixMe: add the new symbol to the watchlist, save it in useStockContext state and persist to AsyncStorage
    var isInvalidSymbol = currentList.includes(newSymbol);
    setLoading(true);
    let stocks = [];
    if (isInvalidSymbol === false || newSymbol === undefined) {
      currentList.push(newSymbol);
      console.log("Katharina: ", currentList);
      postSymbolsToUser(currentList);

      let symbolInfo = await getStocksByCode(newSymbol);
      setState([...state, symbolInfo[0]]);
      AsyncStorage.setItem(newSymbol, newSymbol);
    }
  }

  useEffect(() => {
    //FixMe: Retrieve watchlist from persistent storage
    (async () => {
      const returnedData = await getStocksFromDB("tt");
      const userSymbols = returnedData.Symbols;
      console.log("user symbols from db", userSymbols);
      //await AsyncStorage.clear()

      let retrievedList = [];

      if (currentList.length === 0) {
        setisNewLoad(false);
        setLoading(true);
        retrievedList = await _retrieveData();
        //setRetrievedStocks(retrievedList);
        console.log("retrieved list", retrievedList);
        if (userSymbols !== null) {
          userSymbols.map((symbol) => {
            if (!retrievedList.includes(symbol)) {
              AsyncStorage.setItem(symbol, symbol);
              retrievedList.push(symbol);
            }
          });
        }

        console.log("retrieved data:", retrievedList);
        retrievedList.map((element) => {
          addToWatchlist(element);
        });
      }
    })();
    setLoading(false);
  }, []);

  return {
    ServerURL: "http://131.181.190.87:3001",
    watchList: state,
    loading: loading,
    addToWatchlist,
  };
};

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext, useEffect } from "react";

const StocksContext = React.createContext();

const AV_API_KEY = "GKRUI3TTPZADU2T7";
//const FMP_API_KEY = "1e866a76e34848836623e16619aadb55";
const FMP_API_KEY = "cbf32ae2c42284acaaf341bcb3c243e9";
//const FMP_API_KEY = "b40776c8f4a497b7699489254b470535";

async function getStocksByCode(search) {
  //const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${search}&apikey=${AV_API_KEY}`;
  const url = `https://financialmodelingprep.com/api/v3/quote/${search}?apikey=${FMP_API_KEY}`;
  let res = await fetch(url);
  let data = await res.json();
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
  const [retrievedStocks, setRetrievedStocks] = useState([])
  const [loading, setLoading] = useState(false);
  const [isNewLoad, setisNewLoad] = useState(true);
  // can put more code here

  let _retrieveData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);

      return result.map(value => value[1]);

    } catch (error) {
      // Error retrieving data
    }
  };

  async function addToWatchlist(newSymbol) {
    //FixMe: add the new symbol to the watchlist, save it in useStockContext state and persist to AsyncStorage
    var isInvalidSymbol = currentList.includes(newSymbol);
    setLoading(true);
    let stocks = [];
    if (isInvalidSymbol === false) {
      currentList.push(newSymbol);
      let symbolInfo = await getStocksByCode(newSymbol);
      setState([...state, symbolInfo[0]]);
      AsyncStorage.setItem(newSymbol, newSymbol);
      setLoading(false);
    }
    setLoading(false);
  }

  useEffect(() => {
    
    //FixMe: Retrieve watchlist from persistent storage
    (async () => {
      //await AsyncStorage.clear()
      let retrievedList = [];
      
      if (currentList.length === 0) {
        setisNewLoad(false);
        setLoading(true);
        retrievedList = await _retrieveData()
        //setRetrievedStocks(retrievedList);
        console.log("retrieved data:", retrievedList);
        retrievedList.map((element) => {
              addToWatchlist(element)
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

import { useEffect, useState } from "react";
//import data from './nasdaq_stock_list.json';

const FMP_API_KEY = "1e866a76e34848836623e16619aadb55";

// This function gets a list of different companies with symbols and industry
async function getAllStocks() {
  const url = `https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=${FMP_API_KEY}`;
  let res = await fetch(url);
  const data = await res.json();
  //const data = require('./nasdaq_constituent_new.json');
  return data.map((element) => ({
    Symbol: element.symbol,
    Name: element.name,
    Industry: element.sector,
  }));
}

async function getStocksByCode(search) {
  const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${search}?apikey=${FMP_API_KEY}`;
  let res = await fetch(url);
  let data = await res.json();
  let stockPrices = data["historical"];
  return stockPrices.slice(0, 100).map((element) => ({
    labels: new Date(element.date).toLocaleDateString("en-AU"),
    data: element.close,
    percentage: element.changePercent
  }));
}

async function getStockdetails(search) {
  //const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${search}&apikey=${AV_API_KEY}`;
  const url = `https://financialmodelingprep.com/api/v3/quote/${search}?apikey=${FMP_API_KEY}`;
  let res = await fetch(url);
  let data = await res.json();
  return data;
}

export const useStockDetails = (search) => {
  const [stockDetails, setStockDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setStockDetails(await getStockdetails(search));
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    })();
  }, []);

  return {
    loading,
    stockDetails,
    error,
  };
};


// useStockList functional component async hits the api and returns the stocks
// loading status and errors.
export const useStockList = () => {
  const [stockList, setStockList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setStockList(await getAllStocks());
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    })();
  }, []);

  return {
    loading,
    stockList,
    error,
  };
};

// useStockCodes functional component async hits the api search and returns the stocks
// loading status and errors. It contains error handling, and will not hit the api if
// search is undefined or empty.
export const useStockCodes = (search) => {
  const [loading, setLoading] = useState(true);
  const [stocks, setStocks] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      if (search !== undefined && search !== "") {
        try {
          setStocks(await getStocksByCode(search));
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    })();
  }, [search]);

  return {
    loading,
    stocks,
    error,
  };
};

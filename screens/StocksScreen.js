import React, { useState, useEffect } from "react";
import { Button, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useStocksContext } from "../contexts/StocksContext";
import { scaleSize } from "../constants/Layout";
import { useStockCodes, useStockList } from "../api/Api";

// FixMe: implement other components and functions used in StocksScreen here (don't just put all the JSX in StocksScreen below)
const AV_API_KEY = "COQ9LPN0Z8CC5Z8C";

async function getStocksByCode(search) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${search}&apikey=${AV_API_KEY}`;
  let res = await fetch(url);
  let data = await res.json();
  let stockPrices = data["Global Quote"];
  return stockPrices;
}

export default function StocksScreen({ route }) {
  //const { loading, stocks, error } = useStockCodes(route.params.symbol);
  const { ServerURL, watchList } = useStocksContext();
  const [stockList, setStockList] = useState([]);
  const [state, setState] = useState([]);

  // can put more code here


  useEffect(() => {
    let data = watchList;
    data.map((element) => {
      (async () => {
        if (element !== undefined) {
          stockList.push(await getStocksByCode(element));
          console.log("stocklist", stockList);
          setState(stockList);
          console.log("state", state);
        }
      })();
    });
  }, [watchList, stockList]);

  function stock({ item }) {
    return (
      <TouchableOpacity style={styles.symbolButton} key={item["01. symbol"]}>
        <Text style={styles.stockText}>
          {item["01. symbol"]} {item["02. open"]}
          {parseFloat(item["10. change percent"]) >= 0 && (<Button color="green" disabled={true} title={item["10. change percent"]} ></Button>) }
          {parseFloat(item["10. change percent"]) < 0 && (<Button disabled color="red" title={item["10. change percent"]} ></Button>) }
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={state}
        renderItem={stock}
        keyExtractor={(element) => element["01. symbol"]}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        extraData={watchList}

      />
    </View>
  );
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens

  stockText: {
    color: "white",
    fontSize: 20,
  },
  symbolButton: {
    marginTop: 20,
    padding: 15,

    borderWidth: 1,
    borderBottomColor: "grey",
  },
});

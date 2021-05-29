import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useStocksContext } from "../contexts/StocksContext";
import { StockTab } from "../components/StockTab";

function scaleSize(fontSize) {
  const window = Dimensions.get('window');
  return Math.round((fontSize / 375) * Math.min(window.width, window.height));
}


export default function StocksScreen({ route }) {
  //const { loading, stocks, error } = useStockCodes(route.params.symbol);
  const [state, setState] = useState([]);
  const { ServerURL, watchList, loading } = useStocksContext();
  const [stockList, setStockList] = useState([]);

  const refRBSheet = useRef();

  // can put more code here
  useEffect(() => {
    watchList.map((element) => {
      if (element !== undefined) {
        let isValidSymbol = false;
        isValidSymbol = stockList.includes(element.symbol);

        if (isValidSymbol === false) {
          stockList.push(element.symbol);
          setState([...state, element]);
        }
      } else {
        console.log("You have ran out of Free api calls", state);
        console.log("watchList", watchList);
      }
    });
  }, [watchList]);

  function stock({ item }) {
    return (
      <View style={styles.container}><StockTab stock={item}/></View>
      
    );
  }

  if (loading) {
    return <Text style={styles.stockText}>Loading</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={state}
        renderItem={stock}
        keyExtractor={(element) => element.symbol}
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
  container: {
    flex: 1,
    justifyContent: "center",
    width: Dimensions.get('window').width,
  },
  popup: {
    flex: 1,
    width: Dimensions.get("window").width,
  },
});

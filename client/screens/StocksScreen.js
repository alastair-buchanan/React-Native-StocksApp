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

const FMP_API_KEY = "cbf32ae2c42284acaaf341bcb3c243e9";

export default function StocksScreen({ route }) {
  const [state, setState] = useState([]);
  const { watchList, deleted } = useStocksContext();
  const [stockList, setStockList] = useState([]);
  const [loading, setLoading] = useState(true);

  const refRBSheet = useRef();

  useEffect(() => {
    if (watchList !== undefined) {
      setState(watchList);
    }
  }, [watchList]);

  useEffect(() => {
    setLoading(false);
  }, [state]);

  function stock({ item }) {
    return (
      <View style={styles.container}>
        <StockTab stock={item} />
      </View>
    );
  }

  if (loading) {
    return <Text style={styles.stockText}>Loading</Text>;
  }

  return (
    <View style={styles.container}>
      {state.map((item) => {
        return (
          <View style={styles.container}>
            <StockTab stock={item} />
          </View>
        );
      })}
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
    width: Dimensions.get("window").width,
  },
  popup: {
    flex: 1,
    width: Dimensions.get("window").width,
  },
});

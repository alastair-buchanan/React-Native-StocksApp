import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { useStocksContext } from "../contexts/StocksContext";
import { useStockList } from "../api/Api";
import { SearchBar } from "react-native-elements";
import SignOut from "../components/SignOut";

// FixMe: implement other components and functions used in SearchScreen here (don't just put all the JSX in SearchScreen below)

// filterBySearch function filters stocks by symbol
function filterBySearch(data, param) {
  return data.filter(
    (stock) =>
      stock.Symbol.startsWith(param.toUpperCase()) ||
      stock.Name.startsWith(param)
  );
}
function scaleSize(fontSize) {
  const window = Dimensions.get('window');
  return Math.round((fontSize / 375) * Math.min(window.width, window.height));
}


export default function SearchScreen({ navigation }) {
  const { addToWatchlist } = useStocksContext();
  const [state, setState] = useState({});
  const { loading, stockList, error } = useStockList();
  const [rowData, setRowData] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null);

  // can put more code here
  useEffect(() => {
    let data = stockList;
    if (searchQuery !== null) {
      data = filterBySearch(data, searchQuery);
    }
    setRowData(data);
  }, [stockList, searchQuery, rowData.props]);

  useEffect(() => {
    // FixMe: fetch symbol names from the server and save in local SearchScreen state
  }, []);

  function stock({ item }) {
    return (
      <TouchableOpacity
        style={styles.symbolButton}
        onPress={() => addToWatchlist(item.Symbol)}
      >
        <Text style={styles.symbolText}>
          {item.Symbol} {item.Industry}
        </Text>
        <Text style={styles.symbolText}>{item.Name}</Text>
      </TouchableOpacity>
    );
  }

  function onPress({ item }) {
    () => addToWatchlist(item.Symbol);
    () => navigation.navigate("Stocks", { symbol: item.Symbol });
  }

  const onChangeSearch = (query) => setSearchQuery(query);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Type a company name or a stock symbol.</Text>
      <SearchBar
        placeholder="Search Stocks Here..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        platform="android"
      />

      <FlatList
        data={rowData}
        renderItem={stock}
        keyExtractor={(element) => element.Symbol}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
  titleText: {
    color: "white",
    fontSize: scaleSize(15),
    textAlign: 'center',
    paddingBottom: 10,
  },
  symbolText: {
    color: "white",
    fontSize: scaleSize(20),
  },
  symbolSearch: {
    color: "white",
    fontSize: scaleSize(20),
    margin: 15,
    height: 40,
    borderColor: "#7a42f4",
    borderWidth: 1,
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
    marginTop: 20,
  },
});

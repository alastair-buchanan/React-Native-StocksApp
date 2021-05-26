import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
} from "react-native";
import { useStocksContext } from "../contexts/StocksContext";
import { scaleSize } from "../constants/Layout";
import { Ionicons } from "@expo/vector-icons";
import { useStockList } from "../api/Api";
import { Searchbar } from "react-native-elements";
import SearchBar from "react-native-elements/dist/searchbar/SearchBar-ios";
import { Input } from "react-native-elements/dist/input/Input";

// FixMe: implement other components and functions used in SearchScreen here (don't just put all the JSX in SearchScreen below)

// filterBySearch function filters stocks by symbol
function filterBySearch(data, param) {
  return data.filter((stock) => stock.Symbol.startsWith(param.toUpperCase()));
}

export default function SearchScreen({ navigation }) {
  const { ServerURL, addToWatchlist } = useStocksContext();
  const [state, setState] = useState({
    /* FixMe: initial state here */
  });
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

  function onPress({item}) {
    () => addToWatchlist(item.Symbol);
    () => navigation.navigate('Stocks', { symbol: item.Symbol })
  }

  const onChangeSearch = (query) => setSearchQuery(query);

  return (
    <View style={styles.container}>
      <TextInput
        underlineColorAndroid="white"
        placeholder="Stock Search"
        placeholderTextColor="white"
        autoCapitalize="none"
        style={styles.symbolSearch}
        onChangeText={onChangeSearch}
      ></TextInput>
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
  symbolText: {
    color: "white",
    fontSize: 20,
  },
  symbolSearch: {
    color: "white",
    fontSize: 20,
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
});

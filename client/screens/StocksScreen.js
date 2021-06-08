import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useStocksContext } from "../contexts/StocksContext";
import { StockTab } from "../components/StockTab";
import { scaleSize } from "../components/Utils";


export default function StocksScreen({ route }) {
  const [state, setState] = useState([]);
  const { watchList } = useStocksContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (watchList !== undefined) {
      watchList.filter((element) => element !== undefined);
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

  console.log(state);
  if (loading) {
    return <Text style={styles.stockText}>Loading</Text>;
  }

  return (
    <ScrollView>
      {state.map((item, index) => {
        return (
            <StockTab key={item} stock={item} />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  stockText: {
    color: "white",
    fontSize: scaleSize(20),
  },
});

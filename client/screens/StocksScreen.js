import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { useStocksContext } from "../contexts/StocksContext";
import { StockTab } from "../components/StockTab";
import { scaleSize } from "../constants/Utils";

/**
 * This functional component displays a scrollable list of items contained in
 * the stocksContext watch list.
 */
export default function StocksScreen() {
  const [state, setState] = useState([]);
  const { watchList } = useStocksContext();
  const [loading, setLoading] = useState(true);

  /**
   * This useEffect filters any undefined elements from the stocksContext and adds
   * valid elements to state.
   */
  useEffect(() => {
    if (watchList !== undefined) {
      watchList.filter((element) => element !== undefined);
      setState(watchList);
    }
  }, [watchList]);

  /**
   * This useEffect sets loading to false when state changes.
   */
  useEffect(() => {
    setLoading(false);
  }, [state]);

  if (loading) {
    return <Text style={styles.stockText}>Loading</Text>;
  }

  return (
    <ScrollView>
      {state.map((item) => {
        return <StockTab key={item} stock={item} />;
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

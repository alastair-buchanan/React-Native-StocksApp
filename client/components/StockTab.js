import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { DataTable } from "react-native-paper";
import { SwiperComponent } from "../navigation/SwiperComponent";
import { useStocksContext } from "../contexts/StocksContext";
import { Icon } from "react-native-elements";
import { useStockDetails } from "../api/Api";
import { scaleSize } from "../constants/Utils";

/**
 * This functional component queries the FMP api and returns a stock 
 * to the user in tabular format.
 *
 * @param {String} stock
 */
export const StockTab = ({ stock }) => {
  const { removeSymbol } = useStocksContext();
  const { loading, stockDetails, error } = useStockDetails(stock);
  const [outOfStocks, setOutOfStocks] = useState(false);
  const refRBSheet = useRef();

  /**
   * This useEffect checks if the api has returned an undefined object and 
   * conditionally returns a stock tab or an error message.
   */
  useEffect(() => {
    setOutOfStocks(false);
    if (stockDetails[0] === undefined) {
      setOutOfStocks(true);
    }
  }, [stockDetails]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="grey" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error loading stock. Try again later.
        </Text>
      </View>
    );
  }

  if (outOfStocks) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Out of free API calls</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => refRBSheet.current.open()}
        style={styles.symbolButton}
        key={stock.symbol}
      >
        <DataTable style={styles.container}>
          <DataTable.Row>
            <DataTable.Cell>
              <Text style={styles.stockText}>{stockDetails[0]["symbol"]}</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styles.stockText}>{stockDetails[0]["open"]}</Text>
            </DataTable.Cell>

            <DataTable.Cell>
              <Text style={styles.stockText}>
                {parseFloat(stockDetails[0]["changesPercentage"]) >= 0 && (
                  <Button
                    title={
                      stockDetails[0]["changesPercentage"].toString() + "%"
                    }
                    color="green"
                  ></Button>
                )}
                {parseFloat(stockDetails[0]["changesPercentage"]) < 0 && (
                  <Button
                    title={
                      stockDetails[0]["changesPercentage"].toString() + "%"
                    }
                    color="red"
                  />
                )}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <TouchableOpacity>
                <Text onPress={() => removeSymbol(stockDetails[0]["symbol"])}>
                  <Icon
                    style={{ textAlign: "right" }}
                    name="delete"
                    size={30}
                    color="#e33057"
                  />
                </Text>
              </TouchableOpacity>
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </TouchableOpacity>
      <RBSheet
        ref={refRBSheet}
        height={320}
        closeOnDragDown={true}
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          container: {
            backgroundColor: "#222020",
          },
          draggableIcon: {
            backgroundColor: "#FFFFFF",
          },
        }}
      >
        <SwiperComponent stockInfo={stockDetails[0]} />
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    justifyContent: "space-between",
  },
  errorContainer: {
    //flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "white",
    fontSize: scaleSize(20),
    textAlign: "center",
    padding: scaleSize(20),
  },
  loadingContainer: {
    width: Dimensions.get("window").width,
    justifyContent: "center",
    marginTop: scaleSize(45),
  },
  stockText: {
    color: "white",
    fontSize: scaleSize(20),
  },
  symbolButton: {
    marginTop: scaleSize(20),
    padding: scaleSize(15),
    flex: 1,
    width: Dimensions.get("window").width,
    borderWidth: 1,
    borderBottomColor: "grey",
  },
  errorContainer: {
    paddingBottom: 20,
  },
});

import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { DataTable } from "react-native-paper";
import { StockInfoTable } from "./StockInfoTable";
import { SwiperComponent } from "../navigation/SwiperComponent";
import Swiper from "react-native-swiper/src";
import { StockGraph } from "./StockGraph";
import { useStocksContext } from "../contexts/StocksContext";
import { Icon } from "react-native-elements";
import { useStockDetails } from "../api/Api";

const FMP_API_KEY = "cbf32ae2c42284acaaf341bcb3c243e9";

// async function getStocksByCode(search) {
//   //const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${search}&apikey=${AV_API_KEY}`;
//   const url = `https://financialmodelingprep.com/api/v3/quote/${search}?apikey=${FMP_API_KEY}`;
//   let res = await fetch(url);
//   let data = await res.json();
//   return data;
// }

export const StockTab = ({ stock }) => {
  //const [stockDetails, setStockDetails] = useState();
  const { removeSymbol } = useStocksContext();
  const { loading, stockDetails, error } = useStockDetails(stock);
  const refRBSheet = useRef();
  const windowWidth = useWindowDimensions().width;

  if (loading) {
    return(
      <View><Text>implemenet loading later</Text></View>
    )
  }
  if (error) {
    return(
      <View><Text>implemenet error later</Text></View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => refRBSheet.current.open()}
        delayLongPress={500}
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
                    title={stockDetails[0]["changesPercentage"].toString() + "%"}
                    color="green"
                  ></Button>
                )}
                {parseFloat(stockDetails[0]["changesPercentage"]) < 0 && (
                  <Button
                    title={stockDetails[0]["changesPercentage"].toString() + "%"}
                    color="red"
                  />
                )}
              </Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <TouchableOpacity>
                <Text onPress={() => removeSymbol(stockDetails[0]["symbol"])}>
                  <Icon style={{ textAlign: "right" }} name="delete" size={30} color="#e33057" />
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
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: 10,
    //justifyContent: "center",
  },
  stockText: {
    color: "white",
    fontSize: 20,
  },
  symbolButton: {
    marginTop: 20,
    padding: 15,
    flex: 1,
    width: Dimensions.get("window").width,
    borderWidth: 1,
    borderBottomColor: "grey",
  },
  popup: {
    flex: 1,
    width: Dimensions.get("window").width,
  },
  cellHeader: { justifyContent: "center" },
  head: { fontSize: 20, fontWeight: "bold" },
  title: { flex: 1, fontWeight: "bold" },
  swiper: {
    height: 400,
  },
});

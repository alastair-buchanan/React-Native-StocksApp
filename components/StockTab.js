import React, { useRef } from "react";
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

export const StockTab = ({ stock }) => {
  const refRBSheet = useRef();
  const windowWidth = useWindowDimensions().width;

  const tableTitle = ["1", "2", "3", "4"];
  const tableData = ["a", "b", "c", "d"];

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
              <Text style={styles.stockText}>{stock["symbol"]}</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styles.stockText}>{stock["open"]}</Text>
            </DataTable.Cell>

            <DataTable.Cell>
              <Text style={styles.stockText}>
                {parseFloat(stock["changesPercentage"]) >= 0 && (
                  <Button
                    title={stock["changesPercentage"].toString()}
                    color="green"
                  ></Button>
                )}
                {parseFloat(stock["changesPercentage"]) < 0 && (
                  <Button
                    title={stock["changesPercentage"].toString()}
                    color="red"
                  />
                )}
              </Text>
            </DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </TouchableOpacity>
      <RBSheet
        ref={refRBSheet}
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
        <SwiperComponent stockInfo={stock}/>
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
  wrapper: { flexDirection: "row" },
  title: { flex: 1, fontWeight: "bold" },
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width,
  },
  slide2: {
    //flex: 1,
    //justifyContent: "center",
    //alignItems: "center",
    width: Dimensions.get("window").width,
  },
});

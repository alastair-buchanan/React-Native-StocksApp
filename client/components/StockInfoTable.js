import React from "react";
import { Dimensions, StyleSheet, Text } from "react-native";
import { DataTable } from "react-native-paper";
import { scaleSize } from "./Utils";

export const StockInfoTable = ({ stockInfo }) => {
  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title style={styles.cellHeader}>
          <Text style={styles.head}>{stockInfo.name}</Text>
        </DataTable.Title>
      </DataTable.Header>

      <DataTable.Row style={styles.row}>
        <DataTable.Cell>
          <Text style={styles.title}>OPEN</Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={styles.number}>{stockInfo.open}</Text>
        </DataTable.Cell>
        <DataTable.Cell></DataTable.Cell>
        <DataTable.Cell>
          <Text style={styles.title}>LOW</Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={styles.number}>{stockInfo.dayLow}</Text>
        </DataTable.Cell>
      </DataTable.Row>

      <DataTable.Row style={styles.row}>
        <DataTable.Cell>
          <Text style={styles.title}>CLOSE</Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={styles.number}>{stockInfo.price}</Text>
        </DataTable.Cell>
        <DataTable.Cell></DataTable.Cell>
        <DataTable.Cell>
          <Text style={styles.title}>HIGH</Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={styles.number}>{stockInfo.dayHigh}</Text>
        </DataTable.Cell>
      </DataTable.Row>

      <DataTable.Row>
        <DataTable.Cell>
          <Text style={styles.title}>VOLUME</Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={styles.number}>{stockInfo.volume}</Text>
        </DataTable.Cell>
        <DataTable.Cell></DataTable.Cell>
        <DataTable.Cell></DataTable.Cell>
        <DataTable.Cell></DataTable.Cell>
      </DataTable.Row>
    </DataTable>
  );
};

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens

  stockText: {
    color: "white",
    fontSize: scaleSize(20),
  },
  symbolButton: {
    marginTop: scaleSize(20),
    padding: scaleSize(15),

    borderWidth: 1,
    borderBottomColor: "grey",
  },
  cellHeader: { 
    justifyContent: "center",
    borderBottomColor: "white",
    borderBottomWidth: scaleSize(1)
  },
  head: {
    fontSize: scaleSize(20),
    fontWeight: "bold",
    color: "white",
  },
  wrapper: { flexDirection: "row" },
  title: {
    flex: 1,
    fontWeight: "bold",
    color: "#998989",
  },
  number: {
    color: "white",
  },
  row: {
    borderBottomColor: "white",
    borderBottomWidth: 0.5,
  }
});

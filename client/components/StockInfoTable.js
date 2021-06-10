import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { StyleSheet, Text } from "react-native";
import { DataTable } from "react-native-paper";
import { scaleSize } from "../constants/Utils";

/**
 * This functional component returns information on a stock in table format. The
 * user can toggle between percentage and absolute values.
 * 
 * @param {Object} stockInfo 
 * @returns 
 */
export const StockInfoTable = ({ stockInfo }) => {
  const [toggle, setToggle] = useState(false);
  const [dayLow, setDayLow] = useState(null);
  const [dayOpen, setDayOpen] = useState(null);
  const [dayHigh, setDayHigh] = useState(null);
  const [dayClose, setDayClose] = useState(null);
  const [volume, setVolume] = useState(null);

  /**
   * This function sets the toggle between true and false.
   */
  function handleToggle() {
    if (toggle) {
      setToggle(false);
    } else {
      setToggle(true);
    }
  }

  /**
   * This useEffect sets the information between absolute or percentage based on 
   * the toggle state.
   */
  useEffect(() => {
    const low = stockInfo.dayLow;
    const high = stockInfo.dayHigh;
    const close = stockInfo.price;
    const open = stockInfo.open;
    const previousClose = stockInfo.previousClose;
    setDayLow(low);
    setDayOpen(open);
    setDayHigh(high);
    setDayClose(close);
    setVolume(stockInfo.volume);
    if (toggle) {
      setDayLow(1 - (open / low) + "%");
      setDayOpen(1 - (previousClose / open) + "%");
      setDayHigh(1 - (open / high) + "%");
      setDayClose(1 - (open / high) + "%");
      setVolume(stockInfo.changesPercentage + "%");
    }
  }, [stockInfo, toggle]);

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
          <Text style={styles.number}>{dayOpen}</Text>
        </DataTable.Cell>
        <DataTable.Cell></DataTable.Cell>
        <DataTable.Cell>
          <Text style={styles.title}>LOW</Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={styles.number}>{dayLow}</Text>
        </DataTable.Cell>
      </DataTable.Row>

      <DataTable.Row style={styles.row}>
        <DataTable.Cell>
          <Text style={styles.title}>CLOSE</Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={styles.number}>{dayClose}</Text>
        </DataTable.Cell>
        <DataTable.Cell></DataTable.Cell>
        <DataTable.Cell>
          <Text style={styles.title}>HIGH</Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={styles.number}>{dayHigh}</Text>
        </DataTable.Cell>
      </DataTable.Row>

      <DataTable.Row>
        <DataTable.Cell>
          <Text style={styles.title}>VOLUME</Text>
        </DataTable.Cell>
        <DataTable.Cell numeric>
          <Text style={styles.number}>{volume}</Text>
        </DataTable.Cell>
        <DataTable.Cell></DataTable.Cell>
        <DataTable.Cell></DataTable.Cell>
        <DataTable.Cell>
          <TouchableOpacity
            onPress={() => handleToggle()}
            style={styles.toggleButton}
          >
            <Text style={styles.filterText}>Toggle</Text>
          </TouchableOpacity>
        </DataTable.Cell>
      </DataTable.Row>
    </DataTable>
  );
};

const styles = StyleSheet.create({
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
    borderBottomWidth: scaleSize(1),
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
  },
  toggleButton: {
    elevation: scaleSize(8),
    backgroundColor: "grey",
    borderRadius: scaleSize(10),
    paddingVertical: scaleSize(6),
    paddingHorizontal: scaleSize(2),
    width: scaleSize(60),
  },
  filterText: {
    fontSize: scaleSize(14),
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});

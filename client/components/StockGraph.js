import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { View } from "react-native";
import { Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ScreenWidth } from "react-native-elements/dist/helpers";
import { Button, Title } from "react-native-paper";
import { useStockCodes } from "../api/Api";

function scaleSize(fontSize) {
  const window = Dimensions.get("window");
  return Math.round((fontSize / 375) * Math.min(window.width, window.height));
}

function filterByDate(data, param) {
  let newData;
  let newDate = new Date() - param;
  newData = data.filter((stock) => new Date(stock.Date) < newDate);
  return newData;
}

export const StockGraph = ({ stockInfo }) => {
  const { loading, stocks, error } = useStockCodes(stockInfo.symbol);
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);
  const [filter, setFilter] = useState(undefined);

  const data = {
    labels: labels,
    datasets: [
      {
        data: values,
        color: (opacity = 1) => `rgba(173, 12, 12, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  useEffect(() => {
    if (stocks.length > 0) {
      let newArray = stocks;
      // if (filter !== undefined) {
      //   newArray = filterByDate(stocks, filter);
      // }
      const INDEX = newArray.length / 5;
      let newIndexes = newArray.map((element) => element.labels);
      let newLabels = filterElements(newIndexes, INDEX);
      setLabels(newLabels);
      setValues(newArray.map((element) => element.data));
    }
  }, [stocks, filter]);

  if (loading) {
    return <Text>Implement loading later</Text>;
  }
  if (error) {
    return <Text style={styles.errorText}>Out of free API calls</Text>;
  }
  return (
    <View style={styles.container}>
      <View>
        <Button
          onPress={() => setFilter(7)}
          title="W"
          color="#841584"
        />
      </View>
      <Title style={styles.cellHeader}>
        <Text style={styles.head}>{stockInfo.name}</Text>
      </Title>

      <LineChart
        data={data}
        yAxisInterval={20}
        xLabelsOffset={10}
        width={ScreenWidth}
        height={scaleSize(210)}
        verticalLabelRotation="330"
        chartConfig={chartConfig}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
  head: {
    //justifyContent: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  cellHeader: {
    justifyContent: "center",
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    //paddingBottom: 60,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});

const chartConfig = {
  backgroundColor: "#222020",
  backgroundGradientFrom: "#222020",
  backgroundGradientTo: "#222020",
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  fillShadowGradient: "#AD0C0C",
};

const filterElements = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);

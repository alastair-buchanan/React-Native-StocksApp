import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { View } from "react-native";
import { Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ScreenWidth } from "react-native-elements/dist/helpers";
import { Title } from "react-native-paper";
import { useStockCodes } from "../api/Api";

function scaleSize(fontSize) {
  const window = Dimensions.get('window');
  return Math.round((fontSize / 375) * Math.min(window.width, window.height));
}

export const StockGraph = ({ stockInfo }) => {
  const { loading, stocks, error } = useStockCodes(stockInfo.symbol);
  const [labels, setLabels] = useState([]);
  const [values, setValues] = useState([]);


  useEffect(() => {
    if (stocks.length > 0) {
      setLabels(stocks.map((element) => element.labels));
      setValues(stocks.map((element) => element.data));
    }
  }, [stocks]);


  const chartConfig = {
    backgroundColor: "#222020",
    backgroundGradientFrom: "#222020",
    backgroundGradientTo: "#222020",
    //decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
    fillShadowGradient: "#AD0C0C"
  };

  const data = {
    labels: labels,
    datasets: [
      {
        data: values,
        color: (opacity = 1) => `rgba(173, 12, 12, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    //legend: ["Rainy Days"], // optional
  };

  if (loading) {
    return <Text>Implement loading later</Text>;
  }
  if (error) {
    return <Text>{error}</Text>;
  }
  return (
    <View>
      <Title style={styles.cellHeader}>
        <Text style={styles.head}>{stockInfo.name}</Text>
      </Title>
      
      <LineChart
        data={data}
        yAxisInterval={20}
        //xAxisInterval={20}
        xLabelsOffset={scaleSize(40)}
        width={ScreenWidth}
        height={scaleSize(210)}
        verticalLabelRotation="280"

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
    borderBottomWidth: 1
  },
});
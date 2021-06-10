import React from "react";
import { StyleSheet, View } from "react-native";
import { StockInfoTable } from "../components/StockInfoTable";
import { StockGraph } from "../components/StockGraph";
import Swiper from "react-native-swiper/src";
import { Dimensions } from "react-native";

/**
 * This functional component provides the swipe popup container that holds
 * the stockinfo table and stockgraph.
 * 
 * @param {Object} stockInfo 
 */
export const SwiperComponent = ({ stockInfo }) => {
  return (
    <Swiper style={styles.container}>
      <Swiper style={styles.wrapper} showsButtons={true}>
        <View style={styles.slide1}>
          <StockInfoTable stockInfo={stockInfo} />
        </View>
        <View style={styles.slide2}>
          <StockGraph stockInfo={stockInfo} />
        </View>
      </Swiper>
    </Swiper>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width,
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 60,
    height: Dimensions.get("window").height,
  },
});

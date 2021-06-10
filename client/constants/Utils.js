import { Dimensions } from "react-native";

/**
 * This function is used to scale to fit different window sizes
 * 
 * @param {Number} fontSize 
 */
export function scaleSize(fontSize) {
  const window = Dimensions.get("window");
  return Math.round((fontSize / 375) * Math.min(window.width, window.height));
}

/**
 * This constantis the url for the internal user api
 */
export const USERS_API_URL = "http://172.22.26.173:3000";

/**
 * These constants are keys to acces the stock data from external api's
 */
export const FMP_API_KEY = "1e866a76e34848836623e16619aadb55";
//export const FMP_API_KEY = "cbf32ae2c42284acaaf341bcb3c243e9";
//export const FMP_API_KEY = "b40776c8f4a497b7699489254b470535";
//export const FMP_API_KEY = "78afde332bca5468f9d9cba438c47fb1";
//export const FMP_API_KEY = "2bea2ab26ee9b946dc46e93dd983ef3b";

import { Dimensions } from "react-native";

export function scaleSize(fontSize) {
    const window = Dimensions.get("window");
    return Math.round((fontSize / 375) * Math.min(window.width, window.height));
  }

export const API_URL = "http://172.22.26.173:3000";

export const AV_API_KEY = "GKRUI3TTPZADU2T7";
export const FMP_API_KEY = "1e866a76e34848836623e16619aadb55";
//export const FMP_API_KEY = "cbf32ae2c42284acaaf341bcb3c243e9";
//export const FMP_API_KEY = "b40776c8f4a497b7699489254b470535";
//export const FMP_API_KEY = "78afde332bca5468f9d9cba438c47fb1";
//export const FMP_API_KEY = "2bea2ab26ee9b946dc46e93dd983ef3b";
export const USERS_API_URL = "http://172.22.26.173:3000";

export const filterElements = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import React, { useState, useContext, useEffect } from "react";
// import { StocksProvider } from "./StocksContext";


// const AuthContext = React.createContext([
//   {
//     isLoading: true,
//     isSignout: false,
//     userToken: null,
//   },
//   function () {},
// ]);

// const API_URL = "http://172.22.26.173:3000";

// export const AuthProvider = ({ children }) => {
//   const [state, setState] = useState({
//     isLoading: false,
//     isSignout: false,
//     userToken: null,
//   });
//   useEffect(() => {
//     console.log("state for auth 2", state);
//   }, []);

//   return (
//     <AuthContext.Provider value={[state, setState]}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuthContext = () => {
//   const [state, setState] = useContext(AuthContext);
//   const [retrievedToken, setRetrievedToken] = useState(null);

//   useEffect(() => {
//     let token = null;
//     (async () => {
//       try {
//         token = await AsyncStorage.getItem("token");
//       } catch (error) {
//         console.log(error);
//       }
//       let newState = {
//         isLoading: false,
//         isSignout: false,
//         userToken: token,
//       };
//     })();
//     setState([{
//       isLoading: false,
//       isSignout: false,
//       userToken: token,
//     }]);
//     console.log("state for auth", state);
//   }, []);

//   useEffect(() => {
//     setState([{
//         isLoading: false,
//         isSignout: false,
//         userToken: retrievedToken,
//       }]);
//       console.log("token use effect running", state)
//   }, [retrievedToken])

//   async function getToken() {
//     let token = null;

//     try {
//       token = await AsyncStorage.getItem("token");
//     } catch (error) {
//       console.log("error getting token from async");
//     }
//     await setState([{...state, userToken: token}]);
//     setRetrievedToken(token);
//     console.log("is it setting retrieved token?", retrievedToken);
//     return token;
//     console.log("state for auth", state);
//     console.log("state for auth", token);
//   }

//   async function signIn(data) {
//     fetch(`${API_URL}/users/login`, {
//       method: "POST",
//       headers: {
//         accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email: data.email, password: data.password }),
//     })
//       .then((res) => res.json())
//       .then((res) => {
          
//         if (res.token !== undefined) {
//           AsyncStorage.setItem("token", res.token);
//           setState([
//             {
//               isLoading: false,
//               isSignout: false,
//               userToken: res.token,
//             },
//           ]);
//         } else {
//           //ADD in error handling here later
//           console.log("incorrect login", res);
//         }
//       });
//   }

//   async function signUp(data) {
//     fetch(`${API_URL}/users/register`, {
//       method: "POST",
//       headers: {
//         accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email: data.email,
//         password: data.password,
//         username: data.userName,
//       }),
//     })
//       .then((res) => res.json())
//       .then((res) => {
//         if (res.token !== undefined) {
//           AsyncStorage.setItem("token", res.token);
//           setState({
//             isLoading: false,
//             isSignout: false,
//             userToken: res.token,
//           });
//         } else {
//           //ADD in error handling here later
//           console.log("incorrect registration");
//         }
//       });
//   }

//   function signOut() {
//     setState({
//       isLoading: false,
//       isSignout: true,
//       userToken: null,
//     });
//   }

//   return {
//     returnToken: state.userToken,
//     returnIsLoading: state.isLoading,
//     signIn,
//     signUp,
//     signOut,
//     getToken,
//   };
// };

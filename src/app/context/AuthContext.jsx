// 'use client';


// import { createContext, useContext, useEffect, useState } from "react";

// import axios from "axios";

// const AuthContext = createContext();

// export default function AuthContextProvider({children}){
//     const [user, setUser] = useState(null);
//     const [isLoading, setIsLoading] = useState(true); 

// useEffect(() => {
//     const checkUser = async () => {
//       try {
//         const res = await axios.get("/api/users/me", { withCredentials: true });
//         if (res.data.success) {
//           setUser(res.data.user);
//         } else {
//           setUser(null);
//         }
//       } catch (error) {
//         setUser(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     checkUser();
//   }, []);

//   const login = async (email, password) => {
//   try {
//     const res = await axios.post(
//       '/api/users/login',
//       {
//         email,
//         password,
//         adminLogin: true,
//       },
//       { withCredentials: true }
//     );

//     if (res.data.success) {
//       setUser(res.data.user);
//       return res.data.user;
//     } else {
//       setUser(null);
//       return false;
//     }
//   } catch (error) {
//     console.error("Login failed:", error);
//     setUser(null);
//     return false;
//   }
// };


//   const logout = async () => {
//     try {
//       await axios.post("/api/users/logout"); 
//       setUser(null);
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

  
//     return( <AuthContext.Provider value={{
//         user,
//         isLoading,
//         setUser,
//         login,
//         logout
//     }}>{children}</AuthContext.Provider>);
// }
// export const useAuth = () => useContext(AuthContext);

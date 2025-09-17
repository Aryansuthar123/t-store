'use client';


import { createContext, useContext, useEffect, useState, setIsLoading } from "react";
import axios from "axios";

const AuthContext = createContext();

export default function AuthContextProvider({children}){
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 

useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get("/api/users/me", { withCredentials: true });
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  const logout = async () => {
    try {
      await axios.post("/api/users/logout"); 
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  
    return( <AuthContext.Provider value={{
        user,
        isLoading,
        setUser,
        logout
    }}>{children}</AuthContext.Provider>);
}
export const useAuth = () => useContext(AuthContext);

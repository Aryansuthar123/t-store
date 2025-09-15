'use client';

import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState, setIsLoading } from "react";
import {auth} from "@/lib/firebase"

const AuthContext = createContext();
export default function AuthContextProvider({children}){
    
    const [user, setUser] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true); 
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (firebaseUser)=> {
            if(firebaseUser){
                setUser(firebaseUser);
            } else  {
                setUser(null);
            }
            setIsLoading(false);
        });
        return () => unsub();
    }, [])
    return <AuthContext.Provider value={{
        user,
        isLoading
    }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);

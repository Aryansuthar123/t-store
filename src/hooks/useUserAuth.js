"use client";
import { useState, useEffect } from "react";

export function useUserAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
   
    setUser({ email: "admin@example.com", name: "Admin User" });
  }, []);

  return { user };
}

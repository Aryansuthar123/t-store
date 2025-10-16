"use client"
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",

    })
    const [buttonDisabled, setButtonDisables] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
const searchParams = useSearchParams();
const redirectPath = searchParams.get("redirect")

    const onLogin = async () => {
  setLoading(true);
  try {
    const res = await axios.post("/api/users/login", user, {
      withCredentials: true,
    });

    if (res.data.success) {
      toast.success("Login successfully");

   
      localStorage.setItem("token", res.data.token);

      const isAdmin = res.data.user?.isAdmin;

    
      if (redirectPath) {
        router.push(redirectPath);
      } else if (isAdmin) {
        router.push("/admin");
      } else {
        router.push("/store"); 
      }
    }
  } catch (error) {
    const errMsg =
      error?.response?.data?.error || error?.message || "Login failed";
    toast.error(errMsg);
  } finally {
    setLoading(false);
  }
};


    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>{loading ? "Processing" : "Login"}</h1>
            <hr />
            <label htmlFor="email">email</label >
            <input className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                id="email"
                type="text"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="email" />

            <label htmlFor="password">password</label >
            <input className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                id="password"
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="password" />
            <button onClick={onLogin}
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none  focus:border-gray-600 text-black">
                    Login here </button>
                <Link href="/signup">Visit signup page</Link>
        </div>
    )

}
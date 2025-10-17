"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");
  const adminLogin = searchParams.get("adminLogin") === "true";

  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/users/login", { ...user, adminLogin }, { withCredentials: true });


      if (res.data.success) {
        toast.success("Login successfully");
        console.log("Login response:", res.data);
        console.log("adminLogin flag:", adminLogin);

        const token = res.data.token;
        localStorage.setItem("token", token);

        const jwtDecodeModule = await import("jwt-decode");
        const decodedUser = jwtDecodeModule.default(token);
        localStorage.setItem("decodedUser", JSON.stringify(decodedUser));
          window.dispatchEvent(new Event("userLogin"));
        router.refresh();

        const isAdmin = res.data.user?.isAdmin;
        console.log("isAdmin:", isAdmin);

        if (redirectPath) {
  router.push(redirectPath);
} else if (isAdmin) { 
  router.push("/admin");
} else {
  router.push("/store");
}

      }

    } catch (error) {
      const errMsg = error?.response?.data?.error || error?.message || "Login failed";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center  justify-center min-h-screen py-2 px-2">
      <div className="w-full max-w-sm bg-white  p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-semibold text-center mb-6">Login</h1>

        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
        <input
          id="email"
          type="text"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value.trim().toLowerCase() })}
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-pink-500 text-black" />

        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
        <div className="relative mb-4">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Password"
            className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 text-black" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>
        <div className="px-25">
          <button
            onClick={onLogin}
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-1 px-3  !rounded-lg mb-4 transition-colors duration-200" >
            {loading ? "Processing..." : "Login"}
          </button></div>

        <div className="text-center">
          <Link href="/signup" className="text-pink-500 hover:text-pink-600 text-sm">
            Visit signup page
          </Link>
        </div>
      </div>
    </div>
  );
}

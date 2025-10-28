"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, adminLogin: true }),
      });

      const data = await res.json();
      setLoading(false);

      if (!data.success) {
        toast.error(data.message || "Login failed");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("decodedUser", JSON.stringify(data.user));
      }

      toast.success("Admin login successful!");
      router.push("/admin");
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 px-2 bg-gray-50">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-semibold text-center mb-6 text-gray-800">
          Admin Login
        </h1>

        <form onSubmit={handleLogin}>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-1 text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim().toLowerCase())}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-pink-500 text-black"
          />

          <label
            htmlFor="password"
            className="block text-sm font-medium mb-1 text-gray-700"
          >
            Password
          </label>
          <div className="relative mb-4">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 text-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg mb-3 transition-colors duration-200"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>


        <div className="text-center mt-2">
          <Link
            href="/admin/forgot-password"
            className="text-sm text-pink-500 hover:text-pink-600 font-medium"
          >
            Forgot Password?
          </Link>
        </div>


        <div className="text-center">
          <Link
            href="/login"
            className="text-pink-500 hover:text-pink-600 text-sm font-medium"
          >
            Back to user login
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "", username: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailPattern.test(email);
  };

  const onSignup = async (e) => {
    e.preventDefault();
    if (!user.username || !user.email || !user.password) {
      toast.error("Please fill all fields");
      return;
    }
    if (!validateEmail(user.email)) {
      toast.error("Please enter a valid Gmail address (e.g. example@gmail.com)");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);

      if (response.data.success) {
        toast.success("Signup successful!");
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect") || "/login"; // default login
        router.push(redirect);
      } else {
        toast.error(response.data.message || "Signup failed");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("User already exists");
      } else {
        toast.error(error.response?.data?.error || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 px-2 bg-gray-50">
      <div className="w-full max-w-sm bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-4xl font-semibold text-center mb-6 text-gray-800">Sign Up</h1>

        <form onSubmit={onSignup}>
          <label htmlFor="username" className="block text-sm font-medium mb-1 text-gray-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-pink-500 text-black"/>

          <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value.trim().toLowerCase() })}
            className={`w-full p-3 border rounded-lg mb-4 focus:outline-none focus:border-pink-500 text-black ${
              user.email && !validateEmail(user.email) ? "border-red-500" : "border-gray-300"
            }`}
          />
          {user.email && !validateEmail(user.email) && (
            <p className="text-red-500 text-sm mb-2">Email must include @gmail.com</p>
          )}

          <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700">
            Password
          </label>
          <div className="relative mb-4">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 text-black"/>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
<div>
          <button
            type="submit"
            disabled={loading}
            className=" bg-pink-500 hover:bg-pink-600 text-white font-semibold py-1 px-3 !rounded-lg mb-4 transition-colors duration-200">
            {loading ? "Signing up..." : "Sign Up"}
          </button></div>
        </form>

        <div className="text-center">
          <Link href="/login" className="text-pink-500 hover:text-pink-600 text-sm font-medium">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}

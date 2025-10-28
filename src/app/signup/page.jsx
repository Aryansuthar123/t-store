"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = useState({ email: "", password: "", username: "" });
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (email) => {

        const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return gmailPattern.test(email);
    };
    const onSignup = async () => {
        if (!validateEmail(user.email)) {
            toast.error("Please enter a valid Gmail address (e.g. example@gmail.com)");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            console.log("Signup success:", response.data);
            toast.success("Signup successful! Redirecting to login...");
            router.push("/store");
        } catch (error) {
            console.log("Signup failed", error.message);
            toast.error(error.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user.email && user.password && user.username) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-start min-h-screen pt-20">
            <h1 className="text-3xl mb-6 font-bold">{loading ? "Processing..." : "Signup"}</h1>


            <div className="w-80 mb-4 flex flex-col">
                <label htmlFor="username" className="mb-1 font-semibold">Username</label>
                <input
                    id="username"
                    type="text"
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    placeholder="Username"
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black" />
            </div>

            <div className="w-80 mb-4 flex flex-col">
                <label htmlFor="email" className="mb-1 font-semibold">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    placeholder="example@gmail.com"
                    className={`p-2 border rounded-lg focus:outline-none focus:border-gray-600 text-black ${user.email && !validateEmail(user.email)
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}/>
                {user.email && !validateEmail(user.email) && (
                    <p className="text-red-500 text-sm mt-1">
                        Email must include @gmail.com
                    </p>
                )}
            </div>


            <div className="w-80 mb-4 flex flex-col relative">
                <label htmlFor="password" className="mb-1 font-semibold">Password</label>
                <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    placeholder="Password"
                    className="p-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black" />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-[32px] text-gray-500">
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
            </div>
            <div className="px-20">
                <button
                    onClick={onSignup}
                    disabled={buttonDisabled}
                    className={`w-80 py-2 px-8 mb-4 text-white font-semibold !rounded-lg transition-colors ${buttonDisabled ? "bg-pink-300 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
                        }`} >
                    {loading ? "Processing..." : "Signup"}
                </button>
            </div>

            <Link href="/login" className="text-pink-500 hover:underline">
                Visit login page
            </Link>
        </div>
    );
}

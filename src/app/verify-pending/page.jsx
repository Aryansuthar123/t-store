"use client";
import React from "react";
import Link from "next/link";

export default function VerifyPendingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-2xl p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Verify Your Email</h1>
        <p className="text-gray-600 mb-6">
          We’ve sent a verification link to your email address. Please check your inbox and click the link to verify your account.
        </p>
        <p className="text-gray-500 text-sm">
          Didn’t receive the email? Check your spam folder or{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            sign up again
          </Link>.
        </p>
      </div>
    </div>
  );
}

"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) return;
    fetch(`/api/users/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage("✅ Your email has been verified successfully!");
        } else {
          setMessage("❌ Invalid or expired verification link.");
        }
      })
      .catch(() => setMessage("⚠️ Something went wrong while verifying."));
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-2xl font-bold">{message}</h1>
    </div>
  );
}


"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function ResetPasswordPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const { token } = params;
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword: password }),
      });
      const data = await res.json();
      setLoading(false);

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      router.push("/admin-login");
    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form onSubmit={handleReset} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-4">Reset Admin Password</h1>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full p-3 mb-4 border rounded"
          required
        />
        <button type="submit" className="w-full bg-pink-500 text-white py-2 rounded">
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

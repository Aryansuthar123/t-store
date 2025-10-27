"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "./components/AdminLayout";
import axios from "axios";

export default function Layout({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get("/api/users/me");
        if (res.data?.user?.isAdmin) {
          setIsAdmin(true);
        } else {
          router.replace("/admin-login");
        }
      } catch (err) {
        router.replace("/admin-login");
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return isAdmin ? <AdminLayout>{children}</AdminLayout> : null;
}

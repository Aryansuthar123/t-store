"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminLayout from "./components/AdminLayout";
import axios from "axios";

export default function Layout({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();


  const publicAdminRoutes = ["/admin/forgot-password", "/admin/reset-password"];

  useEffect(() => {
  
    if (publicAdminRoutes.some((route) => pathname.startsWith(route))) {
      setLoading(false);
      return;
    }

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
  }, [router, pathname]);

  if (loading) return <p>Loading...</p>;

 
  if (publicAdminRoutes.some((route) => pathname.startsWith(route))) {
    return <>{children}</>;
  }

  
  return isAdmin ? <AdminLayout>{children}</AdminLayout> : null;
}

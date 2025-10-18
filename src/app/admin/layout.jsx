'use client';

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import AuthContextProvider, { useAuth } from "../context/AuthContext";
import AdminLayout from "./components/AdminLayout";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";

export default function layout({ children }) {
  return (
    <AuthContextProvider>
      <AdminChecking>{children}</AdminChecking>
    </AuthContextProvider>
  );
}

function AdminChecking({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!user && !isLoading && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [user, isLoading, pathname]);

  if (isLoginPage) {
    return children; // 👈 Allow login page without layout or redirect
  }

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  if (!user) {
    return null; // Or loading screen
  }

  return <AdminLayout>{children}</AdminLayout>;
}

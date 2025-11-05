"use client";

import { useUserAuth } from "../../../hooks/useUserAuth";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminHeader({ toggleSidebar }) {
  const router = useRouter();
  const [decodedUser, setDecodedUser] = useState(null);

  useEffect(() => {
   
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("decodedUser");
      if (storedUser) {
        try {
          setDecodedUser(JSON.parse(storedUser));
        } catch (err) {
          console.error("Failed to parse decodedUser:", err);
        }
      }
    }
  }, []);

  const handleAvatarClick = () => {
    router.push("/admin/admins");
  };

  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center bg-white px-6 md:px-8 py-3 shadow-sm z-[100]">
      
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 active:bg-gray-200 transition">
          <Menu size={22} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {decodedUser?.email && (
          <span className="hidden sm:block text-gray-700 font-medium">
            {decodedUser.email}
          </span>
        )}
        <div
          onClick={handleAvatarClick}
          className="cursor-pointer w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-indigo-400 transition-all flex-shrink-0">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="User Avatar"
            className="w-full h-full object-cover"/>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useUserAuth } from "../../../hooks/useUserAuth";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";

export default function AdminHeader({ toggleSidebar }) {
  const { user } = useUserAuth();
  const router = useRouter();

  const handleAvatarClick = () => {
    router.push("/admin/admins");
  };

  return (
    
    <header className="fixed top-0 left-0 w-full flex justify-end items-center bg-white px-8 py-3 shadow-sm z-[100]">
  
  <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 active:bg-gray-200 transition"
        >
          <Menu size={22} />
        </button>
      </div>

      <div
        onClick={handleAvatarClick}
        className="cursor-pointer w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-indigo-400 transition-all flex-shrink-0"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      </div>
    </header>
  );
}


"use client";
import { icons, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { LayoutDashboard, Boxes, LogOut, Layers2} from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from 'react-hot-toast'; 
import axios from "axios";
import { useRouter } from "next/navigation";




export default function Sidebar() {
  const router = useRouter();
  const menuList = [
    {
      name: "Dashboard",
      link: "/admin",
      icon: <LayoutDashboard className="h-5 w-6  text-gray-700 group-hover:text-black" />
    },
    {
      name: "Products",
      link: "/admin/products",
      icon: <Boxes className="h-5 w-6 text-gray-700 group-hover:text-black" />
    },
    {
      name: "Categories",
      link: "/admin/categories",
      icon: <Layers2  className="h-5 w-6 text-gray-700 group-hover:text-black" />
    },
    {
      name: "Admins",
      link: "/admin/admins",
      icon: <ShieldCheck className="h-5 w-6 text-gray-700 group-hover:text-black" />
    },
      
  ]
  return (
    <section className="sticky top-0 flxed left-0  flex flex-col gap-10 bg-white px-2  py-3 h-screen  overflow-hidden w-[260px] z-[1000]">
      <div className="flex justify-center">
        <img className="h-12" src="/favicon.ico" alt="Logo" />
      </div>
      <ul className="flex-1  overflow-y-auto flex flex-col gap-3">
        {
          menuList?.map((item, key) => {
            return <Tab item={item} key={key} />
           
          })}
      </ul>
    <div className="p-2 flex justify-center mt-4"> 
  <button
    onClick={async () => {
      try {
        const res = await axios.post("/api/users/logout");

        if (res.data.success) {
          toast.success(res.data.message || "Successfully logged out");
          router.push("/login");
        } else {
          toast.error(res.data.message || "Logout failed");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Logout failed");
      }
    }}
    className="flex gap-2 items-center px-3 py-1 hover:bg-indigo-100 rounded justify-center ease-soft-spring transition-all duration-600"
  >
    <LogOut className="h-5 w-5" /> Logout
  </button>
</div>

    </section>
  );
}


function Tab({ item }) {
  const pathname = usePathname();
  const isSelected = pathname === item?.link;

  return (
  <li>
    <Link href={item?.link}>
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold  ease-soft-spring transition-all 
        duration-600 ${isSelected ? "bg-[#91a4ec] text-white" : "bg-white text-black"}`}>
        {item?.icon} {item?.name}
      </div>
    </Link>
    </li>
  );
}


"use client";
import { icons } from "lucide-react";
import Link from "next/link";
import { LayoutDashboard, Boxes, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

import { toast } from 'react-hot-toast';


export default function Sidebar() {
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
      name: "Products",
      link: "/admin/products",
      icon: <Boxes className="h-5 w-6 text-gray-700 group-hover:text-black" />
    },
    {
      name: "Products",
      link: "/admin/products",
      icon: <Boxes className="h-5 w-6 text-gray-700 group-hover:text-black" />
    },
    {
      name: "Products",
      link: "/admin/products",
      icon: <Boxes className="h-5 w-6 text-gray-700 group-hover:text-black" />
    },{
      name: "Products",
      link: "/admin/products",
      icon: <Boxes className="h-5 w-6 text-gray-700 group-hover:text-black" />
    },
      
  ]
  return (
    <section className=" flxed left-0 top-0 flex flex-col gap-10 bg-white  py-3 h-screen  overflow-hidden w-[260px]">
      <div className="flex justify-center">
        <img className="h-12" src="/favicon.ico" alt="Logo" />
      </div>
      <ul className="flex-1  overflow-y-auto flex flex-col gap-3">
        {
          menuList?.map((item, key) => {
            return <Tab item={item} key={key} />
           
          })}
      </ul>
     <div className=" p-2 flex justify-center mt-4"> 
      <button onClick={async () =>
      {
        try {
          await toast.promise(signOut(auth),{
            error: (e) => e?.message,
            loading: "Loading...!",
            success: "Successfully logged out",

          });
        } catch (error) {
          toast.error(error?.message);
        }
      }} className="flex gap-2 items-center px-3 py-1 hover:bg-indigo-100 rounded justify-center ease-soft-spring transition-all 
        duration-600">
        <LogOut className=" h-5 w-5"/>Logout
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

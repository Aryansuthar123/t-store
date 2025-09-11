
"use client";
import { icons } from "lucide-react";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export default function Sidebar() {
  const menuList = [
    {
      name: "Dashboard",
      link: "/admin",
      icon: <LayoutDashboard />
    },
    {
      name: "Products",
      link: "/admin/products",
    },
  ]
  return (
    <section className="flex flex-col gap-7  bg-white border-r px-5 py-3 h-screen overflow-hidden md:w-[260px]">
      <div className="flex justify-center">
        <img className="h-12" src="/favicon.ico" alt="" />
        </div>
      <ul className="flex-1 flex flex-col gap-3">
        {
          menuList?.map((item) => {
            return (
              <Link href={item?.link}>
                <li>{item?.name}</li>
              </Link>
            );
          })}
      </ul>
    </section>
  );
}

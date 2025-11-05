"use client";
import { useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";
import {usePathname, } from 'next/navigation';
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  
   const [isOpen, setIsOpen] = useState(false);
   const pathname = usePathname();
   const  sidebarRef = useRef(null);
  
   const router = useRouter();


    const toggleSidebar = () => {
      setIsOpen(!isOpen);
    };


  

useEffect(() => {
  toggleSidebar();
}, [pathname]); 

useEffect(() => {
  function handleClickOutsideEvent(event) {
    if (sidebarRef.current && !sidebarRef?.current?.contains(event.target)) {
      setIsOpen(false);
    }
  }
   if (isOpen) {
      document.addEventListener("mousedown", handleClickOutsideEvent);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideEvent);
    };
  }, [isOpen]);

  return (
    <main className="relative flex">
      <div className="hidden md:block">
      <Sidebar />
      </div>
      <div ref={sidebarRef}
       className={`fixed md:hidden ease-in-out transition-all duration-400  z-50 ${isOpen ? "translate-x-0" : "-translate-x-[260px]"}` }>
      <Sidebar />
      </div>
    <section className="flex-1 bg-amber-50 flex flex-col min-h-screen overflow-hidden">

        <AdminHeader toggleSidebar={toggleSidebar} />
          <section className=" pt-24 flex-1 bg-[#eff3f4] p-6">
            {children}
          </section>
      </section>
    </main>
  ); 
}
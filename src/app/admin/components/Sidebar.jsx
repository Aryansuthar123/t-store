
"use client";
import Link from "next/link";
import { InboxIcon, ShieldCheck,   ShoppingCart, FileText, LayoutDashboard, Boxes, LogOut, Layers2, Index } from "lucide-react";
import { Inbox } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from 'react-hot-toast';
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function Sidebar() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(null);
  const pathname = usePathname();

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
      icon: <Layers2 className="h-5 w-6 text-gray-700 group-hover:text-black" />
    },
     {
      name: "Orders",
      link: "/admin/orders",
      icon: <ShoppingCart  className="h-5 w-6 text-gray-700 group-hover:text-black" />
    },
    {
      name: "Admins",
      link: "/admin/admins",
      icon: <ShieldCheck className="h-5 w-6 text-gray-700 group-hover:text-black" />
    },
    {
      name: "About-Us",
      icon: <FileText className="h-5 w-6 text-gray-700 group-hover:text-black" />,
      children: [
        { name: "Trending Now", link: "/admin/about/trending" },
        { name: "Top Section", link: "/admin/about/top-section" },
        { name: "Top Stories", link: "/admin/about/TopStories"},
      ],
    },

    {
      name: "Contact",
      link: "/admin/contact-us",
      icon: <InboxIcon className="h-5 w-6 text-gray-700 group-hover:text-black" />
    },

  ]
  return (
    <section className="sticky top-0 left-4 flex flex-col gap-10 bg-white px-6 py-3 h-screen overflow-hidden w-[260px] z-[1000]">
      <div className="flex justify-center">
        <img className="h-14" src="/t-store.png" alt="T-Store Logo" />
      </div>


      <ul className="flex-1 overflow-y-auto flex flex-col gap-3">
        {menuList.map((item, key) => (
          <Tab
            key={key}
            item={item}
            pathname={pathname}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu} />
        ))}
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
          className="flex gap-2 items-center px-3 py-1 hover:bg-indigo-100 rounded justify-center transition-all duration-600" >
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </div>
    </section>
  );
}

function Tab({ item, pathname, openMenu, setOpenMenu }) {
  const isSelected = pathname === item?.link;

  if (item.children) {
    const isOpen = openMenu === item.name;

    return (
      <li>
        <button
          onClick={() => setOpenMenu(isOpen ? null : item.name)}
          className={`flex w-full items-center justify-between px-4 py-2 rounded-xl font-semibold transition-all duration-600 ${isOpen ? "bg-indigo-100 text-black" : "bg-white text-black"
            }`} >
          <div className="flex items-center gap-2">
            {item.icon} {item.name}
          </div>
          <span>{isOpen ? "▲" : "▼"}</span>
        </button>


        {isOpen && (
          <ul className="ml-6 mt-2 flex flex-col gap-1">
            {item.children.map((child, i) => (
              <li key={i}>
                <Link href={child.link}>
                  <div
                    className={`flex items-center  py-2 rounded-lg transition-all duration-300 ${pathname === child.link
                        ? "bg-[#91a4ec] text-white"
                        : "hover:bg-gray-100 text-gray-700"
                      }`} >
                    {child.name}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }


  return (
    <li>
      <Link href={item.link}>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-600 ${isSelected ? "bg-[#91a4ec] text-white" : "bg-white text-black"
            }`} >
          {item.icon} {item.name}
        </div>
      </Link>
    </li>
  );
}
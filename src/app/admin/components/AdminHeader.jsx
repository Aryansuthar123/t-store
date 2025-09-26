"use client";
import { useUserAdmin } from "../../../hooks/useUserAdmin";
import { useUserAuth } from "../../../hooks/useUserAuth";
import { Avatar } from "@nextui-org/react";
import { Menu } from "lucide-react";

export default function AdminHeader({toggleSidebar}) {
    const {user} = useUserAuth();
    const {data : admin} = useUserAdmin({email: user?.email});
    return (
        <section className=" fixed w-full top-0 flex items-center gap-3 bg-white px-4 py-3">
            <div className="flex justify-center items-center md:hidden">
                <button onClick={toggleSidebar} >
                    <Menu />
                </button>
            </div>
            <h1 className="text-xl font-semibold">
                Dashboard
            </h1>
            <div>
                 <Avatar size="sm" src={admin?.imageURL}/>
            </div>
        </section>
    )
}
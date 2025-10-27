"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/header.module.css";
import Container from "./Container";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import Link from "next/link";
import { useCart } from "../app/context/CartContext";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import jwtDecode from "jwt-decode";

export default function Header() {
  const router = useRouter();
  const { cartItems } = useCart();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

const dropdownRef = useRef(null);

useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem("token");
      const decodedUser = localStorage.getItem("decodedUser");
      if (token && decodedUser) {
        try {
          setUser(JSON.parse(decodedUser));
        } catch (err) {
          console.error("Invalid token", err);
        }
      } else {
        setUser(null);
      }
    };


    loadUser();
    window.addEventListener("userLogin", loadUser);
    window.addEventListener("userLogout", loadUser);

    return () => {
      window.removeEventListener("userLogin", loadUser);
      window.removeEventListener("userLogout", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("decodedUser");
    setUser(null);
    router.refresh();
  };

  const handleLoginClick = () => {
    const currentPath = window.location.pathname;
    router.push(`/login?redirect=${currentPath}&adminLogin=false`);
  };

  return (
    <header className={`${styles.header} py-3 px-4 shadow`}>
      <Container className="flex justify-between items-center">
        <div className="flex items-center text-4xl -ml-4">
          <Button className="text-pink-500 font-bold" onClick={() => router.push("/")}>
            T-Store<b className="text-black">.</b>
          </Button>
        </div>

        <nav className="flex items-center gap-5">
          <ul className="flex items-center  gap-3 font-semibold">
            <li className={styles.navLink}><Link href="/">Home</Link></li>
            <li className={styles.navLink}><Link href="/store">Store</Link></li>
          </ul>

          <div className="flex items-center gap-4 relative">
            <Link href="/cart" className="relative">
              <FiShoppingCart color="black" size={24} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 hover:bg-pink-300 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {!user ? (
              <Button
                className=" text-black px-4 py-2 !rounded-lg hover:bg-gray-300"
                onClick={handleLoginClick} >
                Sign / Login
              </Button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center w-10 h-10  bg-gray-200 !rounded-full hover:bg-gray-300"   >
                  <FiUser size={20} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-lg border z-50">
                    <div className="px-4 py-2 border-b">
                      <p className="text-sm font-semibold">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100" >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
}

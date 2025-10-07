"use client"
import React, {useState} from "react";
import styles from "@/styles/header.module.css";
import Container from "./Container";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import Link from "next/link";
import { useCart } from '../app/context/CartContext';
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
   const [search, setSearch] = useState("");

   const handleSearch = () => {
    if (search.trim()) {
      router.push(`/store?search=${encodeURIComponent(search)}`);
    } else {
      router.push("/store");
    }
  };
  return (

    <header className={`${styles.header} py-3 px-4 shadow`}>
      <Container className="flex justify-between items-center">

        <div className="flex items-center text-4xl -ml-4 ">
          <Button className="text-pink-500 font-bold " onClick={() => router.push("/")}>
            T-Store<b className="text-black">.</b>
          </Button>
        </div>

        {/* <div className={`${styles.searchBar} flex items-center`}>
          <input type="text"
            placeholder="Search for products..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className={styles.searchButton}
            onClick={handleSearch}
          >
            <FiSearch size={18} />
          </button>
        </div> */}
        <NavBar />
      </Container>
    </header>


  );
};

const NavBar = () => {
  const { cartItems } = useCart();
  return (
    <nav className="flex items-center gap-5" >
      <ul className="flex items-center gap-3 font-semibold">
        <li className={styles.navLink}>
          <Link href={"/"}>Home</Link>
        </li>
        <li className={styles.navLink}>
          <Link href={"/store"}>Store</Link>
        </li>
      </ul>
      <div className="flex items-center gap-4 relative">
        <Link href="/cart" className="relative">
          <FiShoppingCart color="black" size={24} />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};


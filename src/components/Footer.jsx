"use client";
import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container text-left mx-auto  py-4 grid gap-14 md:grid-cols-4">
        <div className="text-left">
          <h3 className="mb-4 text-lg font-semibold text-white">T-Store</h3>

          <p className="text-sm text-gray-400">
            T-Store is an online electronics store offering the latest mobiles,
            laptops, computers, and accessories at unbeatable prices.
          </p>
        </div>
        <div>

          <h3 className="mb-4 text-lg font-semibold  text-white">ABOUT US</h3>
          <div className=" space-y-2">
            <Link
              href="/about-us"
              className="text-white no-underline hover:no-underline hover:text-white" >
              About Us
            </Link>
          </div>
          <div >
            <Link
              href="/contact-us"
              className="text-white no-underline hover:no-underline hover:text-white" >
              Contact Us
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">SHOP</h3>
          <div className="mb-4 flex space-x-4">
            <Link href="/store" className="text-white no-underline hover:text-white">
              Store
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">STAY CONNECTED</h3>
          <div className="mb-3 flex space-x-4">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white">
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white" >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white" >
              <Youtube className="h-6 w-6" />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white">
              <Twitter className="h-6 w-6" />
            </a>
          </div>

          <p className="text-sm">Surat, India</p>
          <p className="text-sm">+91 9500000095</p>
          <p className="text-sm">t-store@gmail.com</p>
        </div>
      </div>
      <div className="border-t border-gray-600 bg-gray-800 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} T-Store. All rights reserved.
      </div>

    </footer>
  );
}

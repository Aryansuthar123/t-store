"use client";
import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-full px-6 md:px-10 lg:px-16 xl:px-24 text-left mx-auto py-8 grid gap-10 md:grid-cols-4">
        <div className="text-left">
          <h3 className="mb-4 text-lg font-semibold relative inline-block">
            <span className="text-pink-500 relative z-10">T-Store<b className="text-black">.</b></span>

          </h3>
          <p className="text-sm text-gray-400">
            T-Store is an online electronics store offering the latest mobiles,
            laptops, computers, and accessories at unbeatable prices.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">ABOUT US</h3>
          <div className="space-y-2">
            <Link
              href="/about-us"
              className="block text-white no-underline decoration-transparent hover:text-gray-300">
              About Us
            </Link>
            <Link
              href="/contact-us"
              className="block text-white no-underline decoration-transparent hover:text-gray-300">
              Contact Us
            </Link>
          </div>

        </div>

        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">SHOP</h3>
          <div className="mb-4 flex space-x-4">
            <Link
              href="/store"
              className="text-white no-underline hover:text-white" >
              Store
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">
            STAY CONNECTED
          </h3>
          <div className="mb-3 flex space-x-4">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300" >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300" >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300" >
              <Youtube className="h-6 w-6" />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-3 00"  >
              <Twitter className="h-6 w-6" />
            </a>
          </div>



          <p className="text-sm flex items-center gap-1">
            <MapPin size={14} className="text-gray-100" />
            &nbsp;Surat, India</p>
          <p className="text-sm flex items-center gap-1">
            <Phone size={14} className="text-gray-100" />
            &nbsp;+91 9500000095
          </p>

          <p className="text-sm flex items-center gap-1">
            <Mail size={14} className="text-gray-100" />
            &nbsp;t-store@gmail.com
          </p>
        </div>
      </div>

      <div className="border-t border-gray-600 bg-gray-800 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} T-Store. All rights reserved.
      </div>
    </footer>
  );
}

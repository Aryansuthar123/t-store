"use client";
import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-7 grid gap-12 md:grid-cols-3">
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">ABOUT US</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/about-us" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact-us" className="hover:text-white">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">SHOP</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/store" className="hover:text-white">
                store
              </Link>
            </li>

          </ul>
        </div>

        
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">STAY CONNECTED</h3>
          <div className="mb-4 flex space-x-4">
            <Link 
              href="#" className="hover:text-white"><Facebook className="h-6 w-6" />
            </Link>
            <Link 
              href="#" className="hover:text-white"><Instagram className="h-6 w-6" />
            </Link>
            <Link
               href="#" className="hover:text-white"><Youtube className="h-6 w-6" />
            </Link>
            <Link 
              href="#" className="hover:text-white"><Twitter className="h-6 w-6" />
            </Link>
          </div>
          <p className="text-sm"> Surat, India</p>
          <p className="text-sm"> +91 9500000095</p>
          <p className="text-sm"> t-store@gmail.com</p>
        </div>

      </div>
      <div className="border-t border-gray-600 bg-gray-800 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} T-Store. All rights reserved.
      </div>
  
    </footer>
  );
}

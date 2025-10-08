import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProductProvider } from './context/ProductContext';
import LayoutWrapper from '@/components/LayoutWrapper'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Toaster } from "react-hot-toast";
import {CartProvider} from "./context/CartContext"



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "T-store",
  description: "T-store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
          <head>
            <link
              href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
              rel="stylesheet"
              integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNLyT2bRJXh0JMHjY6hW+ALEwIH"
              crossOrigin="anonymous" />
          </head>
            <body
              className={`${geistSans.variable} ${geistMono.variable} `}>
              <ProductProvider>
                <CartProvider>
                <LayoutWrapper>
                <Toaster position="top-right" /> 
                  {children}
                </LayoutWrapper>
                </CartProvider>
              </ProductProvider>
            </body>
          
        </html>
  );
}

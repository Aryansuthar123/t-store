import HeroSection from "@/components/Home/HeroSection"
import RecentlyAdded from "@/components/Home/RecentlyAdded"
import FeaturedProduct from "@/components/Home/FeaturedProduct"
import React from "react";
import { Features } from "tailwindcss";
 export default function Home() {
    return(
      <>
        <HeroSection />
        <RecentlyAdded />
        <FeaturedProduct />
        
        
      </>
    )
 }
 
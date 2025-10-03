"use client"
import React from "react";
import styles from "@/styles/Home/hero.module.css";
import Container from "../Container";
import Slider from "./Slider"
import {useRouter} from "next/navigation";

 export default function HeroSection() {
    const router = useRouter();
    return(
      <div>
        <Container>
          <section className={styles.hero}>
            <div className={`${styles.textSection} text-gray-700`}>
              <h1> One stop solution<span className="text-pink-500">T-Store</span></h1>
              <p>
                Discover the latest headphones, earphones, mobiles, tablets, etc.
              </p>
              <p>
                Exclusive deals for you!
              </p>
              <button className={styles.ctaButton} onClick={() => router.push("/store")}
                >Shop Now</button>
            </div>
            <Slider/>
          </section>

        </Container>
       
      </div>
    )
 }
 
"use client";

import React, { useEffect } from "react";
import ListView from "../products/components/ListView"

export default function Page() {
    return(
        <main className=" flex flex-col gap-4 p-5">
            
          
            <ListView />
        </main>
    );
}
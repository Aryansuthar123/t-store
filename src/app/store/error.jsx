"use client"

import Container from "@/components/Container"
import React from "react"

export default function error() {
    return (
        <Container className='col-span-4'>
            <h1 className="text-center text-2xl text-red-500 my-3">
                 Something went Wrong while fetching Products!!
            </h1>
        </Container>
    )
}
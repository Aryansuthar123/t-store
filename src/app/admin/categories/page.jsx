"use client";
import Form from "./components/Form";
import ListView from "./components/ListView";

export default function page() {
    return(
        <main className="flex gap-1">
            <Form />
            <ListView />
        </main>
    )
}
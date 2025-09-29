"use client";
import Form from "./components/Form";
import ListView from "./components/ListView";

export default function page() {
    return(
        <main className="flex flex-1 flex-col gap-6 md:flex-row">
            <Form />
            <ListView />
        </main>
    )
}
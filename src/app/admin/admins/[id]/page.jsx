"use client";
import Form from "../components/Form";

export default function EditAdminPage({ params }) {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Admin</h1>
      <Form id={params.id} />
    </main>
  );
}

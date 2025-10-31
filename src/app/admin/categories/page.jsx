"use client";
import { useState } from "react";
import ListView from "./components/ListView";
import Form from "./components/Form";

export default function Page() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleCreate = () => {
    setEditId(null); // creating new category
    setShowForm(true);
  };

  const handleEdit = (id) => {
    setEditId(id); // set id to edit
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
  };

  return (
    <main className="flex flex-1 flex-col gap-6 md:flex-row">
      {showForm ? (
        <Form id={editId} onCancel={handleBack} />
      ) : (
        <ListView onCreate={handleCreate} onEdit={handleEdit} />
      )}
    </main>
  );
}

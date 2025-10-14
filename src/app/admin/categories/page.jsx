"use client";
import { useState } from "react";
import ListView from "./components/ListView";
import Form from "./components/Form";

export default function Page() {
  const [showForm, setShowForm] = useState(false);

  const handleCreate = () => {
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
  };

  return (
    <main className="flex flex-1 flex-col gap-6 md:flex-row">
      {showForm ? (
        <Form onCancel={handleBack} />
      ) : (
        <ListView onCreate={handleCreate} />
      )}
    </main>
  );
}

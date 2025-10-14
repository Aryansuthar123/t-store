

"use client";

import { useState } from "react"; 
import { useRouter } from "next/navigation";
import ListView from "./components/ListView";
import Form from "./components/Form";

export default function AdminListPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      {showForm ? (
        <Form onClose={() => setShowForm(false)} />
      ) : (
        <ListView onCreate={() => setShowForm(true)} />
      )}
    </div>
  );
}

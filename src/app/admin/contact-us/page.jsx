"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminContactPage() {
  const [contacts, setContacts] = useState([]);
  const router = useRouter();

  // 🟢 Fetch contacts from your API
  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      if (data.success) setContacts(data.contacts || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // 🗑️ Delete handler
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      const result = await res.json();

      if (res.ok && result.success) {
        toast.success("Message deleted successfully!");
        fetchContacts(); // refresh table
      } else {
        toast.error(result.message || "Failed to delete");
      }
    } catch (error) {
      toast.error("Error deleting message");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full ml-1 mt-2 p-1">
      <div className="bg-white rounded-xl shadow-md p-2">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
        </div>

        {contacts.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No messages found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-center w-12">SN</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Name</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Email</th>
                  <th className="border border-gray-300 px-3 py-2 text-left">Phone</th>
                  <th className="border border-gray-300 px-3 py-2 text-left w-80">Message</th>
                  <th className="border border-gray-300 px-3 py-2 text-left w-44">Date</th>
                  <th className="border border-gray-300 px-3 py-2 text-center w-24">Action</th>
                </tr>
              </thead>

              <tbody>
                {contacts.map((c, index) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2 text-center">{index + 1}</td>
                    <td className="border border-gray-300 px-3 py-2">{c.name}</td>
                    <td className="border border-gray-300 px-3 py-2">{c.email}</td>
                    <td className="border border-gray-300 px-3 py-2">{c.phone || "-"}</td>
                    <td className="border border-gray-300 px-3 py-2 text-gray-700 truncate max-w-xs">
                      {c.message}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      {new Date(c.createdAt).toLocaleString()}
                    </td>

                    {/* 🗑️ Delete Button */}
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <Button
                        onClick={() => handleDelete(c._id)}
                        isIconOnly
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

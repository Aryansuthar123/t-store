"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Edit, Trash, ArrowLeft } from "lucide-react";

export default function AdminTopSectionPage() {
  const [abouts, setAbouts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    category: "top",
  });
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchAbouts = async () => {
    const res = await fetch("/api/about");
    const data = await res.json();
    setAbouts(data.filter((item) => item.category === "top"));
  };

  useEffect(() => {
    fetchAbouts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      toast.error("Title and Description are required");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", "top");
      if (file) formData.append("image", file);
      else if (form.image) formData.append("image", form.image);

      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/about?id=${editingId}` : "/api/about";

      const res = await fetch(url, { method, body: formData });
      const result = await res.json();

      if (result.success) {
        toast.success(editingId ? "Updated successfully!" : "Added successfully!");
        setForm({ title: "", description: "", image: "", category: "top" });
        setFile(null);
        setEditingId(null);
        setShowForm(false);
        fetchAbouts();
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting form");
    }
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title,
      description: item.description,
      image: item.image,
      category: item.category,
    });
    setEditingId(item._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    await fetch(`/api/about?id=${id}`, { method: "DELETE" });
    toast.success("Deleted successfully!");
    fetchAbouts();
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 rounded-lg">
    
      {!showForm && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Top Section List</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-pink-500 hover:bg-pink-700 text-white px-3 py-1 rounded">
            Create
          </button>
        </div>
      )}

      {showForm && (
        <div className="border p-4 rounded-lg bg-white shadow mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-700">
              {editingId ? "Edit Top Section" : "Create Top Section"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setForm({ title: "", description: "", image: "", category: "top" });
              }}
              className="flex items-center gap-1 text-gray-700 hover:text-red-600">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border p-2 w-full rounded"
              required/>

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border p-2 w-full rounded"
              required/>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="border p-2 w-full rounded"/>
            {(file || form.image) && (
              <div className="mt-2">
                <Image
                  src={file ? URL.createObjectURL(file) : form.image}
                  alt="Preview"
                  width={200}
                  height={120}
                  className="rounded border"/>
              </div>
            )}
            <div>
              <button
                type="submit"
                className="mt-3 bg-pink-600 hover:bg-pink-700 text-white px-4 py-1 rounded">
                {editingId ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}


      {!showForm && (
        <table className="w-full border text-left bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border p-3 text-left">Sr</th>
              <th className="border p-3 text-left">Title</th>
              <th className="border p-3 text-left">Image</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {abouts.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{index + 1}</td>
                <td className="border px-3 py-2">{item.title}</td>
                <td className="border px-3 py-2 text-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-16 w-24 object-cover mx-auto rounded"/>
                </td>
                <td className="border px-3 py-2">
                  <div className="flex justify-center gap-2 items-center h-full">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-gray-300 text-gray-700 px-3 py-1 rounded flex items-center justify-center"
                      style={{ lineHeight: 1 }}>
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded flex items-center justify-center hover:bg-red-600"
                      style={{ lineHeight: 1 }}>

                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

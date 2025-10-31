"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

export default function AdminTrendingPage() {
  const [abouts, setAbouts] = useState([]);
  const [activeTab, setActiveTab] = useState("Trending");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    category: "Trending",
  });
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchAbouts = async () => {
    const res = await fetch("/api/about");
    const data = await res.json();
    setAbouts(data);
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
      formData.append("category", form.category);
      if (file) formData.append("image", file);
      else if (form.image) formData.append("image", form.image);

      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/about?id=${editingId}` : "/api/about";
      const res = await fetch(url, { method, body: formData });
      const result = await res.json();

      if (result.success) {
        toast.success(editingId ? "Updated successfully!" : "Added successfully!");
        setForm({ title: "", description: "", image: "", category: activeTab });
        setFile(null);
        setEditingId(null);
        setShowForm(false);
        fetchAbouts();
      } else toast.error("Something went wrong");
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
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await fetch(`/api/about?id=${id}`, { method: "DELETE" });
      toast.success("Deleted successfully!");
      fetchAbouts();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">

      <div className="flex gap-6 mb-6 border-b-2 border-gray-300">
        {["Trending", "MeetUs"].map((tab) => (
          <button
            key={tab}
            className={`pb-2 font-semibold text-lg ${activeTab === tab
                ? "border-b-4 border-pink-500 text-pink-600"
                : "text-gray-600"
              }`}
            onClick={() => setActiveTab(tab)}>
            {tab === "Trending" ? "Trending Now" : tab}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {editingId ? "Edit Entry" : "Create New Entry"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setForm({ title: "", description: "", image: "", category: activeTab });
              }}
              className="text-gray-700 hover:text-red-600">
              Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border p-2 rounded"
              required />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border p-2 rounded"
              required />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="border p-2 rounded" />
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
            <select
              className="border p-2 rounded"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="Trending">Trending</option>
              <option value="MeetUs">Meet Us</option>
            </select>
            <button
              type="submit"
              className="mt-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-1 rounded w-fit">
              {editingId ? "Update" : "Add"}
            </button>
          </form>
        </div>
      )}


      {!showForm && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-semibold text-lg">{activeTab} List</h2>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded">
              Create
            </button>
          </div>
          <table className="min-w-full border text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-2 py-2">Sr </th>
                <th className="border px-3 py-2">Title</th>
                <th className="border px-3 py-2">Image</th>
                <th className="border px-3 py-2">Category</th>
                <th className="border px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {abouts
                .filter((item) => item.category === activeTab)
                .map((item, idx) => (
                  <tr key={item._id} className="hover:bg-gray-50 text-center">
                    <td className="border px-3 py-2">{idx + 1}</td>
                     <td className="border px-3 py-2 text-left">{item.title}</td>
                    <td className="border px-3 py-2">
                      <img
                        src={item.image}
                        alt=""
                        className="h-16 w-28 object-cover rounded mx-auto"/>
                    </td>
                   
                    <td className="border px-3 py-2">{item.category}</td>
                    <td className="border px-3 py-2 text-center">
                      <div className="flex justify-center gap-2 items-center h-full">
                        <button
                          onClick={() => handleEdit(item)}
                          className="bg-gray-300 text-gray-600 px-3 py-1 rounded flex items-center justify-center"
                          style={{ lineHeight: 1 }}>
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center justify-center"
                          style={{ lineHeight: 1 }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

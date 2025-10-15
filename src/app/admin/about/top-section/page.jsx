"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Edit, Trash, ArrowLeft, PlusCircle } from "lucide-react";

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
    <div className="p-6">
      {!showForm && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Top Section List</h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-pink-500 hover:bg-pink-700 text-white px-3 py-1 rounded">
            Create
          </button>
        </div>
      )}


      {showForm && (
        <div className="border p-4 rounded-lg bg-gray-50 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">
              {editingId ? "Edit Top Section" : "Create Top Section"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setForm({ title: "", description: "", image: "", category: "top" });
              }}
              className="flex items-center gap-1 text-gray-700 hover:text-red-600" >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border p-2 w-full rounded"
              required />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border p-2 w-full rounded"
              required />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="border p-2 w-full rounded" />

            {(file || form.image) && (
              <div className="mt-2">
                <Image
                  src={file ? URL.createObjectURL(file) : form.image}
                  alt="Preview"
                  width={200}
                  height={120}
                  className="rounded border" />
              </div>
            )}
            <div>
              <button
                type="submit"
                className="mt-3 bg-pink-600 hover:bg-pink-700 text-white px-3 py-1 rounded">
                {editingId ? "Update" : "Add"}
              </button></div>
          </form>
        </div>
      )}


      {!showForm && (
        <table className="w-full border text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Sr no</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Image</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {abouts.map((item, index) => (
              <tr key={item._id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{item.title}</td>
                <td className="border p-2">
                  <img
                    src={item.image}
                    alt=""
                    className="h-16 mx-auto object-cover rounded" />
                </td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded" >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded" >
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

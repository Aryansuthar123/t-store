"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Edit, Trash } from "lucide-react";

export default function TopStoriesPage() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    const res = await fetch("/api/about?type=TopStories");
    const result = await res.json();
    setData(result || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", "TopStories");
    if (form.image) formData.append("image", form.image);

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/about?id=${editingId}` : "/api/about";

    const res = await fetch(url, { method, body: formData });
    const result = await res.json();

    if (result.success) {
      toast.success(editingId ? "Updated successfully!" : "Added successfully!");
      setForm({ title: "", description: "", image: null });
      setEditingId(null);
      setShowForm(false);
      fetchData();
    } else {
      toast.error(result.error || "Something went wrong");
    }
  };

  const handleEdit = (item) => {
    setForm({
      title: item.title,
      description: item.description,
      image: null,
    });
    setEditingId(item._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    await fetch(`/api/about?id=${id}`, { method: "DELETE" });
    toast.success("Deleted successfully!");
    fetchData();
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50 rounded-lg">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Top Stories</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setForm({ title: "", description: "", image: null });
          }}
          className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-400 transition">
          {showForm ? "Back to List" : "Create"}
        </button>
      </div>

   
      {!showForm && (
        <table className="w-full border rounded-lg overflow-hidden bg-white shadow">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border p-3 text-left">Sr</th>
              <th className="border p-3 text-left">Title</th>
              <th className="border p-3 text-left">Image</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{index + 1}</td>
                  <td className="border px-3 py-2">{item.title}</td>
                  <td className="border px-3 py-2 text-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover mx-auto rounded"/>
                  </td>
                  <td className="border px-3 py-2">
                    <div className="flex justify-center gap-2 items-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-gray-300 text-gray-700 px-3 py-1 rounded flex items-center justify-center hover:bg-gray-400">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded flex items-center justify-center hover:bg-red-600">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

    
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 max-w-md bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700">
            {editingId ? "Edit Top Story" : "Create Top Story"}
          </h2>

          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border p-2 rounded"
            required/>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border p-2 rounded"/>

          <input
            type="file"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
            className="border p-2 rounded bg-white"/>

          <div>
            <button className="bg-pink-600 text-white px-3 py-1 rounded hover:bg-pink-700 transition">
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

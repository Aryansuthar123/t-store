"use client";
import { useState, useEffect } from "react";

export default function TopSectionPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    const res = await fetch("/api/about");
    const result = await res.json();
   
    setData(result.filter((item) => item.category === "top"));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", "top");
    if (image) formData.append("image", image);

    const url = editingId ? `/api/about?id=${editingId}` : "/api/about";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      body: formData,
    });

    const result = await res.json();

    if (result.success) {
      alert(editingId ? "Updated successfully!" : "Added successfully!");
      setTitle("");
      setDescription("");
      setImage(null);
      setEditingId(null);
      fetchData();
    } else {
      alert(result.error || "Something went wrong");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setTitle(item.title);
    setDescription(item.description);
    setImage(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    const res = await fetch(`/api/about?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Deleted successfully");
      fetchData();
    } else {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Top Section (About Page)</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"/>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button
          className={`py-2 rounded text-white ${editingId ? "bg-yellow-500" : "bg-pink-600"}`}>
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <table className="w-full mt-6 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Sr no</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Image</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={item._id}>
              <td className="border p-2 text-center">{i + 1}</td>
              <td className="border p-2">{item.title}</td>
              <td className="border p-2 text-center">
                <img
                  src={item.image}
                  alt=""
                  className="w-16 h-16 object-cover mx-auto rounded"
                />
              </td>
              <td className="border p-2 text-center">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-500 text-white px-3 py-1 rounded" >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded" >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

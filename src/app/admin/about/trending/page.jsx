"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Edit, Trash } from "lucide-react";

export default function AdminTrendingPage() {
    const [abouts, setAbouts] = useState([]);
    const [activeTab, setActiveTab] = useState("Trending");
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

        try {
            if (!form.title || !form.description) {
                toast.error("Title and Description are required");
                return;
            }

            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("category", form.category);

            if (file) {
                formData.append("image", file);
            } else if (form.image) {
                formData.append("image", form.image);
            }

            const method = editingId ? "PUT" : "POST";
            const url = editingId ? `/api/about?id=${editingId}` : "/api/about";

            const res = await fetch(url, {
                method,
                body: formData,
            });

            const result = await res.json();

            if (result.success) {
                toast.success(editingId ? "Updated successfully!" : "Added successfully!");
                setForm({
                    title: "",
                    description: "",
                    image: "",
                    category: activeTab,
                });
                setFile(null);
                setEditingId(null);
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
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        await fetch(`/api/about?id=${id}`, { method: "DELETE" });
        toast.success("Deleted successfully!");
        fetchAbouts();
    };

    return (
        <div className="p-6">
            <div className="flex gap-4 mb-4">
                <button
                    className={`text-lg font-semibold border-b-2 pb-1 ${activeTab === "Trending" ? "border-pink-500" : "border-transparent"
                        }`}
                    onClick={() => setActiveTab("Trending")} >
                    Trending Now
                </button>
                <button
                    className={`text-lg font-semibold border-b-2 pb-1 ${activeTab === "MeetUs" ? "border-pink-500" : "border-transparent"
                        }`}
                    onClick={() => setActiveTab("MeetUs")} >
                    Meet Us
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
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
                <select
                    className="border p-2 w-full rounded"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })} >
                    <option value="Trending">Trending</option>
                    <option value="MeetUs">Meet Us</option>
                </select>

                <button
                    type="submit"
                    className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded">
                    {editingId ? "Update" : "Add"}
                </button>
            </form>


            <table className="w-full border text-left">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Sr no</th>
                        <th className="border p-2">Title</th>
                        <th className="border p-2">Image</th>
                        <th className="border p-2">Category</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {abouts
                        .filter((item) => item.category === activeTab)
                        .map((item, index) => (
                            <tr key={item._id}>
                                <td className="border p-2">{index + 1}</td>
                                <td className="border p-2">{item.title}</td>
                                <td className="border p-2">
                                    <img src={item.image} alt="" className="h-16 mx-auto" />
                                </td>
                                <td className="border p-2">{item.category}</td>
                                <td className="border p-2 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="bg-gray-300 text-gray-600 px-3 py-1 rounded" >
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
        </div>
    );
}

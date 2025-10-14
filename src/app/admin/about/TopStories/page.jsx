'use client';
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Edit, Trash } from "lucide-react";
export default function TopStoriesPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [data, setData] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const fetchData = async () => {
        const res = await fetch("/api/about?type=topStories");
        const result = await res.json();
        setData(result);
    };


    const [form, setForm] = useState({
        title: "",
        description: "",
        image: null,
        category: "TopStories",
    });

    useEffect(() => {
        fetchData();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", "TopStories");
        if (image) formData.append("image", image);

        const res = await fetch("/api/about", {
            method: "POST",
            body: formData,
        });

        const result = await res.json();

        if (result.success) {
            alert("Added successfully!");
            setTitle("");
            setDescription("");
            setImage(null);
            fetchData();
        } else {
            alert(result.error || "Something went wrong");
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
        fetchData();
    };


    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Top Stories (About Page)</h1>

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
                    className="border p-2 rounded" />
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                <button className="bg-pink-600 text-white py-2 rounded">Add</button>
            </form>

            <table className="w-full mt-6 border">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border p-2">Sr no</th>
                        <th className="border p-2">Title</th>
                        <th className="border p-2">Image</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, i) => (
                        <tr key={item._id}>
                            <td className="border p-2 text-center">{i + 1}</td>
                            <td className="border p-2">{item.title}</td>
                            <td className="border p-2 text-center">
                                <img src={item.image} alt="" className="w-16 h-16 object-cover mx-auto" />
                            </td>
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

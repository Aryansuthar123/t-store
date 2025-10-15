"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Edit, Trash } from "lucide-react";

export default function TopStoriesPage() {
    const [data, setData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const fetchData = async () => {
        const res = await fetch("/api/about?type=topStories");
        const result = await res.json();
        setData(result);
    };

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
            toast.success("Added successfully!");
            setTitle("");
            setDescription("");
            setImage(null);
            setShowForm(false);
            fetchData();
        } else {
            toast.error(result.error || "Something went wrong");
        }
    };

    const handleEdit = (item) => {
        setTitle(item.title);
        setDescription(item.description);
        setImage(null);
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
        <div className="p-6">

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Top Stories</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-pink-600 text-white px-3 py-1 rounded hover:bg-pink-700 transition">
                    {showForm ? "Back to List" : "Create"}
                </button>
            </div>


            {!showForm ? (

                <table className="w-full border rounded-lg overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Sr No</th>
                            <th className="border p-2">Title</th>
                            <th className="border p-2">Image</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, i) => (
                                <tr key={item._id} className="hover:bg-gray-50">
                                    <td className="border p-2 text-center">{i + 1}</td>
                                    <td className="border p-2">{item.title}</td>
                                    <td className="border p-2 text-center">
                                        <img
                                            src={item.image}
                                            alt=""
                                            className="w-16 h-16 object-cover mx-auto rounded" />
                                    </td>
                                    <td className="border p-2 flex gap-2 justify-center">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="bg-gray-300 text-gray-600 px-3 py-1 rounded hover:bg-gray-400">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                            <Trash className="w-4 h-4" />
                                        </button>
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
            ) : (

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-3 max-w-md bg-gray-50  p-6 rounded-lg shadow" >
                    <h2 className="text-xl font-semibold mb-2">Create Top Story</h2>

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
                        className="border p-2 rounded"  />
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="border p-2 rounded bg-white"  />
                        <div>
                    <button className="bg-pink-600 text-white  px-3 py-1 rounded hover:bg-pink-700 transition">
                        {editingId ? "Update" : "Add"}
                    </button></div>
                </form>
            )}
        </div>
    );
}

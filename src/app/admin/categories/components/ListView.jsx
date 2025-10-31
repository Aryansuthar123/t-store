"use client";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteCategory } from "../../../../lib/categoryService";

export default function ListView({ onCreate, onEdit }) {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await deleteCategory(id);
      toast.success("Deleted successfully");
      fetchCategories();
    } catch (err) {
      toast.error(err?.message || "Failed to delete category");
    }
  };

  return (
    <div className="min-h-screen rounded-lg bg-gray-50 w-full ml-1 mt-1 p-2">
      <div className="bg-white rounded-xl shadow-md p-3">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <button
            onClick={onCreate}
            className="bg-pink-600 text-white px-3 py-1 rounded hover:bg-pink-700"
          >
            Create
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border border-gray-300 px-3 py-2 text-center w-12">
                  SN
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center w-24">
                  Image
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left">
                  Name
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, index) => (
                <tr key={cat._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <img
                      src={cat.image || "/default-avatar.png"}
                      alt={cat.name}
                      className="w-10 h-10 object-cover rounded mx-auto"
                    />
                  </td>
                  <td className="border border-gray-300 px-3 py-2 font-medium text-gray-800">
                    {cat.name}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onEdit(cat._id)}
                        className="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center text-gray-500 py-6 border border-gray-300"
                  >
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

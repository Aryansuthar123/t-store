"use client";
import { Button } from "@nextui-org/react";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteCategory, updateCategory } from "../../../../lib/categoryService";

import { useRouter } from "next/navigation";


export default function ListView({ onCreate, onEdit }) {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    if (data.success) setCategories(data.categories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;

    try {
      await deleteCategory(id);
      toast.success("Deleted successfully");
      fetchCategories();
    } catch (err) {
      toast.error(err?.message);
    }
  };

  return (
    <div className="flex flex-col flex-1 md:pr-5 md:px-0 px-5  bg-white p-2 rounded-xl">
      <div className="flex justify-between   items-center mb-3">
        <h1 className="font-semibold text-lg">Categories</h1>
        <button
          onClick={onCreate}
          className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600" >
          Create
        </button>
      </div>

      <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 border w-12">SN</th>
            <th className="p-3 border w-24">Image</th>
            <th className="p-3 border  w-56">Name</th>
            <th className="p-3 border text-center w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, index) => (
            <tr key={cat._id} className="text-center hover:bg-gray-50">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-10 h-10 object-cover rounded mx-auto"  />
              </td>
              <td className="p-2 border font-medium">{cat.name}</td>
              <td className="p-2 flex justify-center border-r-lg gap-2 text-gray-600">
                <Button
                  onClick={() => handleEdit(cat._id)}
                  isIconOnly
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300" >
                  <Pencil size={16} />
                </Button>
                <Button
                  onClick={() => handleDelete(cat._id)}
                  isIconOnly
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

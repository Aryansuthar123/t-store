"use client";
import { Button } from "@nextui-org/react";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ListView() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.categories);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

return (

    <div className="bg-white p-5 rounded-xl flex-1">
      <h1 className="font-semibold mb-5 text-lg">Categories</h1>

      <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 border w-12">SN</th>
            <th className="p-3 border w-24">Image</th>
            <th className="p-3 border w-56">Name</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead> 
        <tbody>
          {categories.map((cat, index) => {
           return (
            <Row cat={cat} index={index} key={index} />
           )
          }
        )}
        </tbody>
      </table>
    </div>
  );
}


function Row({cat, index}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async ()=> {
    setIsDeleting(true);
    try {
      await deletCategory({ id: cat?.id });
      toast.success("Successfully Deleted");
    } catch (error) {
      toast.error(error?.message); 
    }
    setIsDeleting(false)
  };
   return (
            <tr key={cat._id} className="text-center hover:bg-gray-50">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-10 h-10 object-cover rounded mx-auto"
                />
              </td>
              <td className="p-2 border font-medium">{cat.name}</td>
              <td className="p-2 flex justify-center border-r-lg gap-2 text-gray-600">
                <button
                  onClick={() => handleEdit(cat._id)}
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300">
                  <Pencil size={16} />
                </button>
                <Button
                  onClick={handleDelete}
                  isLoading={isDeleting}
                  isDisable={isDeleting}
                  isIconOnly
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                  <Trash2 size={16} />
                </Button></td>
            </tr>
            ) 
}
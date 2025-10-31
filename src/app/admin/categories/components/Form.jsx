"use client";
import { getCategory } from "../../../../lib/categoryService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Form({ id, onCancel }) {
  const [data, setData] = useState({});
  const [image, setImage] = useState(null);

  const fetchData = async () => {
    if (!id) return;

    try {
      const res = await getCategory(id);
      if (!res) {
        toast.error("Category not found!");
      } else {
        setData(res);
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleData = (key, value) => {
    setData((prev) => ({
      ...(prev ?? {}),
      [key]: value,
    }));
  };

  const handleCreate = async () => {
    try {
      if (!data?.name || !data?.slug) {
        alert("Name and slug are required!");
        return;
      }
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      if (image) formData.append("image", image);

      const res = await fetch("/api/categories", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        alert("Category Created Successfully");
        setData({});
        setImage(null);
        onCancel();
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      console.error("Error creating category:", err);
    }
  };

  const handleEdit = async () => {
    try {
      if (!data?.name || !data?.slug) {
        alert("Name and Slug are required!");
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      if (image) formData.append("image", image);

      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        alert("Category Updated Successfully");
        onCancel();
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  return (
    <div className="flex flex-col gap-3 bg-white rounded-xl p-3 w-full md:w-[350px] lg:w-[400px]">
      <h1 className="font-semibold">{id ? "Edit" : "Create"} Category</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (id) handleEdit();
          else handleCreate();
        }}
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="category-image" className="text-gray-500 text-sm">
            Image (optional)
          </label>
          {(image || data?.image) && (
            <div className="flex justify-center items-center p-3">
              <img
                className="h-20"
                src={image ? URL.createObjectURL(image) : data.image}
                alt="Category"
              />
            </div>
          )}
          <input
            onChange={(e) => {
              if (e.target.files.length > 0) setImage(e.target.files[0]);
            }}
            id="category-image"
            type="file"
            className="border px-4 py-2 rounded-lg w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="category-name" className="text-gray-500 text-sm">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="category-name"
            type="text"
            placeholder="Enter Name"
            value={data?.name ?? ""}
            onChange={(e) => handleData("name", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="category-slug" className="text-gray-500 text-sm">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="category-slug"
            type="text"
            placeholder="Enter Slug"
            value={data?.slug ?? ""}
            onChange={(e) => handleData("slug", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-400"
          >
            {id ? "Update" : "Create"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

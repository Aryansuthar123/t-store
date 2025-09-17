"use client";
import { useState } from "react";

export default function Form() {
  const [data, setData] = useState({});
  const [image, setImage] = useState(null);

  const handleData = (key, value) => {
    setData((preData) => ({
      ...(preData ?? {}),
      [key]: value,
    }));
  };

  const handleCreate = async () => {
    try {
      if (!data?.name || !data?.slug || !image) {
        alert("All fields are required!");
        return;
      }

      // FormData banani hai kyunki image bhej rahe ho
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("slug", data.slug);
      formData.append("image", image);

      const res = await fetch("/api/categories", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      console.log("API Response:", result);

      if (result.success) {
        alert("Category Created Successfully ✅");
        setData({});
        setImage(null);
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      console.error("Error creating category:", err);
    }
  };

  return (
    <div className="flex flex-col gap-3 bg-white rounded-xl p-4 w-full md:w-[400px] ">
      <h1 className="font-semibold ">Create Categories</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreate();
        }}
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="category-image" className="text-gray-500 text-sm">
            Image <span className="text-red-500">*</span>
          </label>
          {image && (
            <div className="flex justify-center items-center p-3">
              <img className="h-20" src={URL.createObjectURL(image)} alt="" />
            </div>
          )}
          <input
            onChange={(e) => {
              if (e.target.files.length > 0) {
                setImage(e.target.files[0]);
              }
            }}
            id="category-image"
            name="category-image"
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
            name="category-name"
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
            name="category-slug"
            type="text"
            placeholder="Enter Slug"
            value={data?.slug ?? ""}
            onChange={(e) => handleData("slug", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Create
        </button>
      </form>
    </div>
  );
}

"use client";
import {  getAdmin} from "@/lib/adminService";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";



export default function Form() {
  
  const [data, setData] = useState({});
  const [image, setImage] = useState(null);
  const [isLoading, setISLoading] = useState(false); 
  const router = useRouter();

  const searchParems = useSearchParams();
  const id = searchParems.get('id');

  const fetchData = async()=>{
    try {
      const res = await getAdmin(id);
    console.log("Fetched Admin:", res);
      if (!res) {
        toast.error("Admin not found!");

      }else{
        setData(res);
        
      }
    } catch (error) {
      toast.error(error?.message)
    }
  }
useEffect(() => {
  console.log("useEffect triggered with id:", id);
  if (id) {
    fetchData();
  }
}, [id]);


  const handleData = (key, value) => {
    setData((preData) => ({
      ...(preData ?? {}),
      [key]: value,
    }));
  };


const handleCreate = async () => {try {
      if (!data?.name || !data?.email ) {
        alert("Name and email are required!");
        return;
      }
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (image) {
     formData.append("image", image);
      }

      const res = await fetch("/api/admins", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      console.log("API Response:", result);

      if (result.success) {
        alert("Admin Created Successfully ");
        setData({});
        setImage(null);
      } else {
        alert("Error: " + result.error);
      }
    } catch (err) {
      console.error("Error creating Admin:", err);
    }
  };
const handleEdit = async () => {
    try {

      if (!data?.name || !data?.email) {
        alert("All file are required!");
        return;
      }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
   if (image) {
      formData.append("image", image);
    }

     const res = await fetch(`/api/admins/${id}`, {
      method: "PUT",
      body: formData,
    });
    
    const result = await res.json();
    console.log("API Response:", result);

    if (result.success) {
        alert("Admin Updated Successfully");
    router.push("/admin/admins");
      fetchAdmin();
    } else {
      alert("Error: " + result.error);
    }
  } catch (err) {
    console.error("Error updating Admin:", err);
  }
};


  return (
    <div className="flex flex-col gap-3 bg-white rounded-xl p-3 w-full md:w-[350px] lg:w-[400px]">
      <h1 className="font-semibold ">{id ? "Edit" : "Create" } Admin</h1>
      <form
            onSubmit={(e) => {
              e.preventDefault();
              if (id) {
                handleEdit();  
              } else {
                handleCreate(); 
              }
            }}
            className="flex flex-col gap-3" >
       
<div className="flex flex-col gap-1">
          <label htmlFor="category-image" className="text-gray-500 text-sm">
            Image (optional)<span className="text-red-500">*</span>
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
          <label htmlFor="Admin-name" className="text-gray-500 text-sm">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="Admin-name"
            name="Admin-name"
            type="name"
            placeholder="Enter name"
            value={data?.name ?? ""}
            onChange={(e) => handleData("name", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>
            <div className="flex flex-col gap-1">
          <label htmlFor="Admin-email" className="text-gray-500 text-sm">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="Admin-email"
            name="Admin-email"
            type="email"
            placeholder="Enter Email"
            value={data?.email ?? ""}
            onChange={(e) => handleData("email", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {id ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}

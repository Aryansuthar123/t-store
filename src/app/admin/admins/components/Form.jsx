"use client";
import { getAdmin } from "../../../../lib/adminService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Form({ id }) {   
  const [data, setData] = useState({});
  const [image, setImage] = useState(null);
  const router = useRouter();


  
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await getAdmin(id);
        if (!res) {
          toast.error("Admin not found!");
        } else {
          setData(res);
        }
      } catch (err) {
        toast.error(err?.message);
      }
    };
    fetchData();
  }, [id]);

  const handleData = (key, value) =>
    setData((prev) => ({ ...(prev ?? {}), [key]: value }));

  const handleCreate = async () => {
    try {
      if (!data?.username || !data?.email) return alert("All fields required");
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      if (image) formData.append("image", image);

      const res = await fetch("/api/users", { method: "POST", body: formData });
      console.log("RAW RESPONSE =>", res);
      const result = await res.json();
console.log("PARSED RESULT =>", result);

      if (result.success) {
         console.log("Created Admin:", result.user);
        alert("Admin created");
        router.push("/admin/admins"); 
      } else alert("Error: " + result.error);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async () => {
    try {
      if (!data?.username || !data?.email) return alert("All fields required");
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      if (image) formData.append("image", image);

      const res = await fetch(`/api/users/${id}`, { method: "PUT", body: formData });
      const result = await res.json();
      if (result.success) {
        alert("Admin updated");
        router.push("/admin/admins"); 
      } else alert("Error: " + result.error);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-3 bg-white rounded-xl p-3 w-full md:w-[350px]">
      <h1 className="font-semibold">{id ? "Edit" : "Create"} Admin</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          id ? handleEdit() : handleCreate();
        }}
        className="flex flex-col gap-3"
      >
       
        <input
          type="file"
          onChange={(e) => e.target.files[0] && setImage(e.target.files[0])}
          className="border px-4 py-2 rounded-lg w-full"
        />

  
        <input
          type="text"
          placeholder="Name"
          value={data?.username ?? ""}
          onChange={(e) => handleData("username", e.target.value)}
          className="border px-4 py-2 rounded-lg w-full"
        />

     
        <input
          type="email"
          placeholder="Email"
          value={data?.email ?? ""}
          onChange={(e) => handleData("email", e.target.value)}
          className="border px-4 py-2 rounded-lg w-full"
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {id ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}

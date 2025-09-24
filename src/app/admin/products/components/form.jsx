"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getProducts } from "../../../../lib/productService";
import toast from "react-hot-toast";

export default function Form() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

   useEffect(() => {
    if (id) {
      setLoading(true);
      getProduct(id)
        .then((product) => {
          setData(product);
        })
        .catch((err) => {
          console.error("Error fetching product:", err);
          toast.error("Error fetching product");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);


  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">
        {id ? "Edit Product" : "Create New Product"}
      </h1>

       {loading ? (
        <p>Loading...</p>
      ) : (
      <form className="mt-5">
        <input
          type="text"
          placeholder="Title"
          defaultValue={data?.title || ""}
          className="border p-2 w-full mb-3"
        />
        <input
          type="number"
          placeholder="Price"
          defaultValue={data?.price || ""}
          className="border p-2 w-full mb-3"
        />
    
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {id ? "Update Product" : "Create Product"}
        </button>
      </form>
      )}
    </div>
  );
}

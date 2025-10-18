"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProduct, createNewProduct, updateProduct } from "../../../../lib/productService";
import toast from "react-hot-toast";
import { createNewProduct, updateProduct } from "../../../../lib/productService";

export default function Form() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    price: "",
    shortDescription: "",
    description: "",
    category: "",
    stock: "",
    salePrice: "",
    featureImage: "",
    featureImagePreview: "",
    images: [],          
    imagesPreview: [],   
  });


  useEffect(() => {
    if (id) {
      setLoading(true);
      getProduct(id)
        .then((product) => {
          console.log("Fetched product:", product);
          if (!product) {
            toast.error("Product not found");
            return;
          }
          setData({
            title: product.title || "",
            price: product.price || "",
            shortDescription: product.shortDescription || "",
            description: product.description || "",
            category: product.category || "",
            stock: product.stock || "",
            salePrice: product.salePrice || "",
            featureImage: product.featureImage || "",
            images: product.images || [],
            imagesPreview: product.images || [],
          });
        })
        .catch((err) => {
          console.error("Error fetching product:", err);
          toast.error("Error fetching product");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 
       
        const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await updateProduct(id, {
          ...data,
          featureImage: data.featureImage,
          images: data.images,
        });
        toast.success("Product updated!");
      } else {
        await createNewProduct({
          ...data,
          featureImage: data.featureImage,
          images: data.images,
        });
        toast.success("Product created!");
      }
      router.push("/dashboard/products");
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-5">
      <h1 className="text-xl bg-gray-400 hover:bg-gray-500 !rounded-lg font-bold">
        {id ? "Edit Product" : "Create New Product"}
      </h1>

      {loading ? (
        <p className="mt-5">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={data.title}
            onChange={handleChange}
            className="border p-2 w-full"/>

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={data.price}
            onChange={handleChange}
            className="border p-2 w-full"/>

          <input
            type="number"
            name="salePrice"
            placeholder="Sale Price"
            value={data.salePrice}
            onChange={handleChange}
            className="border p-2 w-full" />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={data.stock}
            onChange={handleChange}
            className="border p-2 w-full"/>

          <textarea
            name="shortDescription"
            placeholder="Short Description"
            value={data.shortDescription}
            onChange={handleChange}
            className="border p-2 w-full"/>

          <textarea
            name="description"
            placeholder="Description"
            value={data.description}
            onChange={handleChange}
            className="border p-2 w-full" />

          <input
            type="text"
            name="category"
            placeholder="Category ID"
            value={data.category}
            onChange={handleChange}
            className="border p-2 w-full"/>

          {(data.featureImagePreview || (typeof data.featureImage === "string" && data.featureImage)) && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Preview:</p>
              <img
                src={data.featureImagePreview || data.featureImage}
                alt="Feature Preview"
                className="w-40 h-40 object-cover border mt-1"/>
            </div>
          )}
          <input
            type="file"
            name="featureImage"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setData((prev) => ({
                  ...prev,
                  featureImage: file,
                  featureImagePreview: URL.createObjectURL(file),
                }));
              }
            }} />

              {data.imagesPreview?.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {data.imagesPreview.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`preview-${idx}`}
                      className="w-24 h-24 object-cover border" />
                  ))}
                </div>
              )}

              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  setData((prev) => ({
                    ...prev,
                    images: files,
                    imagesPreview: files.map((file) => URL.createObjectURL(file)),
                  }));
                }}
                className="mt-2"/>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}>
            {loading ? "Saving..." : id ? "Update Product" : "Create Product"}
          </button>
        </form>
      )}
    </div>
  );
}

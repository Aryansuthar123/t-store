import axios from "axios";

export async function createNewProduct({ data, featureImage, imageList }) {
  const payload = {
    ...data,
    featureImage: featureImage ? featureImage.name : "", 
    images: imageList.map((file) => file.name), 
  };

  const res = await fetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create product");

  return res.json();
}



export async function getProduct(id) {
  if (!id) throw new Error("ID is required");
  const res = await axios.get(`/api/products/${id}`);
  return res.data.product;
}

export const deleteProduct = async (id) => {
  if (!id) throw new Error("ID is required");
  const res = await axios.delete(`/api/products/${id}`);
  return res.data;
};
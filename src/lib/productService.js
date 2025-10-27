
import axios from "axios";

const api = axios.create({ baseURL: "/api/products" });

export const createNewProduct = async (data) => {
  const formData = new FormData();


  [
    "title",
    "shortDescription",
    "description",
    "category",
    "stock",
    "price",
    "salePrice"
  ].forEach((key) => {
    if (data[key] !== undefined && data[key] !== null && data[key] !== "")
      formData.append(key, data[key]);
  });

  if (data.featureImage instanceof File) {
    formData.append("featureImage", data.featureImage);
  }


  if (Array.isArray(data.images)) {
    data.images.forEach((img) => {
      if (img instanceof File) formData.append("images", img);
    });
  }

  const res = await api.post("/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.product;
};

export const getProducts = async () => {
  const res = await api.get("/");
  return res.data.products;
};

export const getProduct = async (id) => {
  const res = await api.get(`/${id}`);
  return res.data.product;
};

export const updateProduct = async (id, data) => {
  const formData = new FormData();

  [
    "title",
    "shortDescription",
    "description",
    "category",
    "stock",
    "price",
    "salePrice"
  ].forEach((key) => {
    if (data[key] !== undefined && data[key] !== null && data[key] !== "")
      formData.append(key, data[key]);
  });

 
  if (data.featureImage instanceof File) {
    formData.append("featureImage", data.featureImage);
  }

  
  if (Array.isArray(data.images)) {
    data.images.forEach((img) => {
      if (img instanceof File) formData.append("images", img);
    });
  }

  const res = await api.put(`/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.product;
};


export const deleteProduct = async (id) => {
  await api.delete(`/${id}`);
};


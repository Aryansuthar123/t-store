import axios from "axios";

export const createNewProduct = async (data) => {
  const res = await axios.post("/api/products", data);
  return res.data.product;
};

export const getProducts = async () => {
  const res = await axios.get("/api/products");
  return res.data.products;
};

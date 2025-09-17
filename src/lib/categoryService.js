import axios from "axios";

export const createNewCategory = async (data) => {
  const res = await axios.post("/api/categories", data);
  return res.data.category;
};

export const getCategories = async () => {
  const res = await axios.get("/api/categories");
  return res.data.categories;
};

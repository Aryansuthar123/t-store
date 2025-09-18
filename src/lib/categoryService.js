import axios from "axios";

export const createNewCategory = async (formData) => {
  const res = await axios.post("/api/categories", formData);
  return res.data.category;
};

export const getCategories = async () => {
  const res = await axios.get("/api/categories");
  return res.data.categories;
};

export const delectCaategory = async ({ id }) => {
  if(!id) {
    throw new Error("ID is required");
  }
  await deleteDoc(doc(Db, `categories/${id}`));
};
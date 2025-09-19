import axios from "axios";

export const createNewCategory = async (formData) => {
  const res = await axios.post("/api/categories", formData);
  return res.data.category;
};

export const getCategories = async () => {
  const res = await axios.get("/api/categories");
  return res.data.categories;
};

export const updateCategory = async ( id, data ) => {
  if (!id) {
    throw new Error("ID is required");
  }
  const res = await axios.put(`/api/categories/${id}`, data);
  return res.data.category;
};
export const deleteCategory = async (id) => {
  if (!id) throw new Error("ID is required");
  const res = await axios.delete(`/api/categories/${id}`);
  return res.data;
};


export async function getCategory(id) {
  try {
    const res = await fetch(`/api/categories/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch category");
    }

    const data = await res.json();
    if (data.success) {
      return data.category;
    } else {
      throw new Error(data.error || "Category not found");
    }
  } catch (err) {
    throw err;
  }
}

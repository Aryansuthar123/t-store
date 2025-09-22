import axios from "axios";

export const createNewAdmin = async (formData) => {
  const res = await axios.post("/api/admins", formData);
  return res.data.admin;
};

export const getAdmins = async () => {
  const res = await axios.get("/api/admins");
  return res.data.admin;
};

export const updateAdmin = async ( id, data ) => {
  if (!id) {
    throw new Error("ID is required");
  }
  const res = await axios.put(`/api/admins/${id}`, data);
  return res.data.admin;
};
export const deleteAdmin = async (id) => {
  if (!id) throw new Error("ID is required");
  const res = await axios.delete(`/api/admins/${id}`);
  return res.data;
};


export async function getAdmin(id) {
  try {
    const res = await fetch(`/api/admins/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch Admin");
    }

    const data = await res.json();
    if (data.success) {
      return data.admin;
    } else {
      throw new Error(data.error || "Admin not found");
    }
  } catch (err) {
    throw err;
  }
}

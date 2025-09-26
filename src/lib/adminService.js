import axios from "axios";

export const createNewAdmin = async (formData) => {
  const res = await axios.post("/api/users", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.user;
};

export const getAdmins = async () => {
  const res = await axios.get("/api/users?>role=admin");
  return res.data.users;
};

export const updateAdmin = async ( id, data ) => {
  if (!id) {
    throw new Error("ID is required");
  }
  const res = await axios.put(`/api/users/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.user;

};
export const deleteAdmin = async (id) => {
  if (!id) throw new Error("ID is required");
  const res = await axios.delete(`/api/users/${id}`);
  return res.data;
};


export async function getAdmin(id) {
  try {
    const res = await fetch(`/api/users/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch Admin");
    }

    const data = await res.json();
    if (data.success) {
      return data.user;
    } else {
      throw new Error(data.error || "Admin not found");
    }
  } catch (err) {
    throw err;
  }
}


export async function toggleApproval(id, isApproved) {
  const res = await fetch(`/api/users/${id}/approve`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isApproved }),
  });
  return res.json();
}
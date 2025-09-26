
import axios from "axios";

const api = axios.create({ baseURL: "/api/products" });

// Create product with images (FormData)
export const createNewProduct = async (data) => {
  const formData = new FormData();

  // append text fields
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

  // single feature image
  if (data.featureImage instanceof File) {
    formData.append("featureImage", data.featureImage);
  }

  // multiple images
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


// import axios from "axios";

// const api = axios.create({
//   baseURL: "/api/products",
 
// });


// export const createNewProduct = async (data) => {
//   const formData = new FormData();

//   // Normal fields
//   for (const key in data) {
//     if (
//       key !== "featureImage" &&
//       key !== "images" &&
//       data[key] !== undefined &&
//       data[key] !== null &&
//       data[key] !== ""
//     ) {
//       formData.append(key, data[key]);
//     }
//   }

//   // Single feature image
//   if (data.featureImage instanceof File) {
//     formData.append("featureImage", data.featureImage);
//   }

//   // Multiple gallery images
//   if (Array.isArray(data.images)) {
//     data.images.forEach((img) => {
//       if (img instanceof File) {
//         formData.append("images", img);
//       }
//     });
//   }

//   try {
//     const res = await api.post("/", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return res.data;
//   } catch (err) {
//     console.error("createNewProduct error:", err.response?.data || err.message);
//     throw new Error(err.response?.data?.message || "Failed to create product");
//   }
// };


// export const getProducts = async () => {
//   const res = await api.get("/");
//   return res.data.products;  
// };

// export const getProduct = async (id) => {
//   const res = await api.get(`/${id}`);
//   return res.data.product;   
// };


// export const updateProduct = async (id, data) => {
//   if (!id) throw new Error("ID is required");

//   const formData = new FormData();

//   for (const key in data) {
//      if (key !== "featureImage" && data[key] !== undefined && data[key] !== null) {
//       formData.append(key, data[key]);
//     }
//   }
//     if (data.featureImage instanceof File) {
//         formData.append("featureImage", data.featureImage);
//       }
//   try {
//     const res = await axios.put(`/api/products/${id}`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data", 
//       },
//     });
//     return res.data;
//   } catch (err) {
//     throw new Error(err.response?.data?.error || "Failed to update product");
//   }
// };



// export const deleteProduct = async (id) => {
//   if (!id) throw new Error("ID is required");
//   try {
//     const res = await api.delete(`/${id}`);
//     return res.data;
//   } catch (err) {
//     throw new Error(err.response?.data?.error || "Failed to delete product");
//   }
// };

// "use client";
// import { getCategories , getCategory} from "@/lib/categoryService";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";


// export default function Form() {
  
//   const [data, setData] = useState({});
//   const [image, setImage] = useState(null);
//   const [isLoading, setISLoading] = useState(false); 
//   const router = useRouter();

//   const searchParems = useSearchParams();
//   const id = searchParems.get('id');

//   const fetchData = async()=>{
//     try {
//       const res = await getCategory(id);
//     console.log("Fetched category:", res);
//       if (!res) {
//         toast.error("Category not found!");

//       }else{
//         setData(res);
        
//       }
//     } catch (error) {
//       toast.error(error?.message)
//     }
//   }
// useEffect(() => {
//   console.log("useEffect triggered with id:", id);
//   if (id) {
//     fetchData();
//   }
// }, [id]);


//   const handleData = (key, value) => {
//     setData((preData) => ({
//       ...(preData ?? {}),
//       [key]: value,
//     }));
//   };


// const handleCreate = async () => {try {
//       if (!data?.name || !data?.slug ) {
//         alert("Name and slug are required!");
//         return;
//       }
//       const formData = new FormData();
//       formData.append("name", data.name);
//       formData.append("slug", data.slug);
//      if (image) {
//            formData.append("image", image); 
//             }

//       const res = await fetch("/api/categories", {
//         method: "POST",
//         body: formData,
//       });

//       const result = await res.json();
//       console.log("API Response:", result);

//       if (result.success) {
//         alert("Category Created Successfully ");
//         setData({});
//         setImage(null);
//       } else {
//         alert("Error: " + result.error);
//       }
//     } catch (err) {
//       console.error("Error creating category:", err);
//     }
//   };
// const handleEdit = async () => {
//     try {

//       if (!data?.name || !data?.slug) {
//         alert("Name and Slug are required!");
//         return;
//       }

     
      
//     const formData = new FormData();
//     formData.append("name", data.name);
//     formData.append("slug", data.slug);
//     if (image) {
//       formData.append("image", image);
//     }

//      const res = await fetch(`/api/categories/${id}`, {
//       method: "PUT",
//       body: formData,
//     });
//     const result = await res.json();
//     console.log("API Response:", result);

//     if (result.success) {
//         alert("Category Updated Successfully");
//     router.push("/admin/categories");

//     } else {
//       alert("Error: " + result.error);
//     }
//   } catch (err) {
//     console.error("Error updating category:", err);
//   }
// };


//   return (
//     <div className="flex flex-col gap-3 bg-white rounded-xl p-3 w-full md:w-[350px] lg:w-[400px]">
//       <h1 className="font-semibold ">{id ? "Edit" : "Create" } Category</h1>
//       <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               if (id) {
//                 handleEdit();  
//               } else {
//                 handleCreate(); 
//               }
//             }}
//             className="flex flex-col gap-3" >
//         <div className="flex flex-col gap-1">
//           <label htmlFor="category-image" className="text-gray-500 text-sm">
//             Image (optional)<span className="text-red-500">*</span>
//           </label>
//           {(image || data?.image) && (
//             <div className="flex justify-center items-center p-3">
//               <img
//                 className="h-20"
//                 src={image ? URL.createObjectURL(image) : data.image}
//                 alt="Category"
//               />
//             </div>
//           )}
//           <input
//             onChange={(e) => {
//               if (e.target.files.length > 0) {
//                 setImage(e.target.files[0]);
//               }
//             }}
//             id="category-image"
//             name="category-image"
//             type="file"
//             className="border px-4 py-2 rounded-lg w-full"
//           />
//         </div>

//         <div className="flex flex-col gap-1">
//           <label htmlFor="category-name" className="text-gray-500 text-sm">
//             Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             id="category-name"
//             name="category-name"
//             type="text"
//             placeholder="Enter Name"
//             value={data?.name ?? ""}
//             onChange={(e) => handleData("name", e.target.value)}
//             className="border px-4 py-2 rounded-lg w-full focus:outline-none"
//           />
//         </div>

//         <div className="flex flex-col gap-1">
//           <label htmlFor="category-slug" className="text-gray-500 text-sm">
//             Slug <span className="text-red-500">*</span>
//           </label>
//           <input
//             id="category-slug"
//             name="category-slug"
//             type="text"
//             placeholder="Enter Slug"
//             value={data?.slug ?? ""}
//             onChange={(e) => handleData("slug", e.target.value)}
//             className="border px-4 py-2 rounded-lg w-full focus:outline-none"
//           />
//         </div>

//         <button
//           type="submit"
//           className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
//         >
//           {id ? "Update" : "Create"}
//         </button>
//       </form>
//     </div>
//   );
// }

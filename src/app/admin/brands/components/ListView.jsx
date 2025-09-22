// "use client";
// import { Button } from "@nextui-org/react";
// import { Pencil, Trash2 } from "lucide-react";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { deleteCategory } from "@/lib/categoryService";
// import { updateCategory } from "@/lib/categoryService";
// import { useRouter } from "next/navigation";


// export default function ListView() {
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     fetch("/api/categories")
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) {
//           setCategories(data.categories);
//         }
//       })
//       .catch((err) => console.error("Error fetching categories:", err));
//   }, []);

// return (

//     <div className="flex flex-col  gap-3 md:pr-5 md:px-0 px-5 bg-white p-5 rounded-xl  flex-1">
//       <h1 className="font-semibold mb-5 text-lg">Categories</h1>

//       <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
//         <thead className="bg-gray-100 text-gray-700">
//           <tr>
//             <th className="p-3 border w-12">SN</th>
//             <th className="p-3 border w-24">Image</th>
//             <th className="p-3 border w-56">Name</th>
//             <th className="p-3 border">Actions</th>
//           </tr>
//         </thead> 
//         <tbody>
//           {categories.map((cat, index) => {
//            return (
//             <Row cat={cat} index={index} key={index} />
//            )
//           }
//         )}
//         </tbody>
//       </table>
//     </div>
//   );
// }


// function Row({cat, index}) {
//   const [isDeleting, setIsDeleting] = useState(false);
//   const router = useRouter(); 

//   const handleDelete = async (id)=> {
//     if (!confirm("Are you sure?") ) return;
//     setIsDeleting(true);
    
//     try {
//       await deleteCategory(id);
//       toast.success("Successfully Deleted");
//       fetchCategories();
//     } catch (error) {
//       toast.error(error?.message); 
//     }
//     setIsDeleting(false)
//   };


//   const handleEdit = (id) => {
//    router.push(`/admin/categories?id=${cat._id}`);
//   // try {
//   //   const edit = await editCategory(id, { name: "editing Name" });
//   //   toast.success("Successfully Updated");
//   //   fetchCategories(); 
//   // } catch (error) {
//   //   toast.error(error?.message || "Error editing category");
//   // } 
// };
//    return (
//             <tr key={cat._id} className="text-center hover:bg-gray-50">
//               <td className="p-2 border">{index + 1}</td>
//               <td className="p-2 border">
//                 <img
//                   src={cat.image}
//                   alt={cat.name}
//                   className="w-10 h-10 object-cover rounded mx-auto"
//                 />
//               </td>
//               <td className="p-2 border font-medium">{cat.name}</td>
//               <td className="p-2 flex justify-center border-r-lg gap-2 text-gray-600">
//                 <Button
//                   onClick={() => handleEdit(cat._id)}
//                   isDisabled={isDeleting}
//                   isIconOnly
//                   className="p-2 bg-gray-200 rounded hover:bg-gray-300">
//                   <Pencil size={16} />
//                 </Button>
//                 <Button
//                   onClick={() => handleDelete(cat._id)}  
//                   isLoading={isDeleting}
//                   isDisabled={isDeleting}
//                   isIconOnly
//                   className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
//                   <Trash2 size={16} />
//                 </Button></td>
//             </tr>
//             ) 
// }
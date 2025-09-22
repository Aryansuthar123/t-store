"use client";
import { Button } from "@nextui-org/react";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteAdmin } from "@/lib/adminService";
import { updateAdmin } from "@/lib/adminService";
import { useRouter } from "next/navigation";


export default function ListView() {
  const [admins, setAdmins] = useState([]);
  
const fetchAdmins = async () => {
  try {
    const res = await fetch("/api/admins");
    const data = await res.json();
    if (data.success) {
      setAdmins(data.admins);
    }
  } catch (err) {
    console.error("Error fetching Admins:", err);
  }
};

  useEffect(() => {
    
       fetchAdmins();
  }, []);

return (

    <div className="flex flex-col  gap-3 md:pr-5 md:px-0 px-5 bg-white p-5 rounded-xl  flex-1">
      <h1 className="font-semibold mb-5 text-lg">Admin</h1>

      <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 border w-12">SN</th>
            <th className="p-3 border w-20">Image</th>
            <th className="p-3 border w-56">Name</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead> 
        <tbody>
          { admins.map((admin, index) => {
           return (
            <Row admin={admin} index={index} key={index} />
           )
          }
        )}
        </tbody>
      </table>
    </div>
  );
}


function Row({admin,  index}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter(); 

  const handleDelete = async (id)=> {
    if (!confirm("Are you sure?") ) return;
    setIsDeleting(true);
    
    try {
      await deleteAdmin(id);
      toast.success(" Admin Successfully Deleted");
      fetchAdmin();
    } catch (error) {
      toast.error(error?.message); 
    }
    setIsDeleting(false)
  };


  const handleEdit = (id) => {
   router.push(`/admin/admins?id=${admin._id}`);
  // try {
  //   const edit = await editCategory(id, { name: "editing Name" });
  //   toast.success("Successfully Updated");
  //   fetchCategories(); 
  // } catch (error) {
  //   toast.error(error?.message || "Error editing category");
  // } 
};
   return (
            <tr key={admin._id} className="text-center hover:bg-gray-50">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">
                <img
                  src={admin.image}
                  alt={admin.name}
                  className="w-16 h-16 object-contain rounded-lg mx-auto"
                />
              </td>
            <td className="p-2 border">
                <div className="flex flex-col items-center">
                  <h2 style={{ fontSize: "18px", fontWeight: "400" }}>{admin.name}</h2>
                  <h3 style={{ fontSize: "14px", fontWeight: "400", color: "gray" }}>{admin.email}</h3>
                </div>
              </td>
              <td className="p-2 flex justify-center border-r-lg gap-2 text-gray-600">
                <Button
                  onClick={() => handleEdit(admin._id)}
                  isDisabled={isDeleting}
                  isIconOnly
                  className="p-2 bg-gray-200 rounded hover:bg-gray-300">
                  <Pencil size={16} />
                </Button>
                <Button
                  onClick={() => handleDelete(admin._id)}  
                  isLoading={isDeleting}
                  isDisabled={isDeleting}
                  isIconOnly
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
                  <Trash2 size={16} />
                </Button></td>
            </tr>
            ) 
}
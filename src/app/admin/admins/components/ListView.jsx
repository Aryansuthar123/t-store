"use client";

import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button} from "@nextui-org/react";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { toggleApproval, deleteAdmin } from "@/lib/adminService";
import { useRouter } from "next/navigation";

export default function ListView() {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [admins, setAdmins] = useState([]);
  const router = useRouter();

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/users?role=admin");
      const data = await res.json();
      if (data.success) setAdmins(data.users);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleConfirm = async () => {
  try {
    const res = await fetch(`/api/admins/${selectedUser._id}/approve`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: !selectedUser.isApproved })
    });
    const updated = await res.json();

 
    setAdmins((prev) =>
      prev.map((a) => (a._id === updated._id ? updated : a))
    );

    setOpen(false);
  } catch (err) {
    console.error(err);
  }
};


  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteAdmin(id);
      toast.success("Admin deleted");
      fetchAdmins();
    } catch (err) {
      toast.error(err?.message);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl">
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">SN</th>
            <th className="p-3 border">Image</th>
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin, index) => (
            <tr key={admin._id} className="text-center">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">
                <img
                  src={admin.image || "/default-avatar.png"}
                  alt={admin.username}
                  className="w-12 h-12 object-cover rounded-lg mx-auto"
                />
              </td>
              <td className="p-2 border">
                <div>
                  <div>{admin.username}</div>
                  <div className="text-gray-500 text-xs">{admin.email}</div>
                </div>
              </td>
              <td className="p-2 border">
                <div className="flex justify-center gap-3">
                
                  <Button
                    color={admin.isApproved ? "success" : "warning"}
                    variant="flat"
                    onClick={() => {
                      setSelectedUser(admin);
                      setOpen(true);
                    }}
                  >
                    {admin.isApproved ? "Approved" : "Approve"}
                  </Button>

                  <Button
                    onClick={() => router.push(`/admin/admins/${admin._id}`)}
                    color="default"
                    variant="flat"
                  >
                    <Pencil size={16} />
                  </Button>

                  <Button
                    color="danger"
                    variant="flat"
                    onClick={() => handleDelete(admin._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

   
      <Modal isOpen={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>Confirm Approval</ModalHeader>
          <ModalBody>
            {selectedUser && (
              <p>
                {selectedUser.isApproved
                  ? `Remove approval from ${selectedUser.username}?`
                  : `Give approval to ${selectedUser.username}?`}
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setOpen(false)}>Cancel</Button>
            <Button color="primary" onPress={handleConfirm}>Yes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteAdmin, toggleApproval } from "../../../../lib/adminService";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../../../../hooks/useUserAuth";

export default function ListView({ onCreate }) {
  const [admins, setAdmins] = useState([]);

  const [approvalModal, setApprovalModal] = useState({
    open: false,
    userId: null,
    currentStatus: false,
  });
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
  <ListView onCreate={() => setShowForm(true)} />
  useEffect(() => {
    fetchAdmins();
  }, []);

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
  const { user: currentUser } = useUserAuth(); 

  return (
    <div className="min-h-screen rounded-lg bg-gray-50 w-full  mt-2 p-3">
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-semibold text-lg">Admins</h1>
        <button
          onClick={onCreate}
          className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600" >
          Create
        </button>
      </div>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">SN</th>
            <th className="p-3 border">Image</th>
            <th className="p-3 border">Name</th>
            <th className="p-3 border text-left w-32">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin, index) => (
            <tr key={admin._id} className="text-center">
              <td className="p-2 border text-left">{index + 1}</td>
              <td className="p-2 border items-end">
                <img
                  src={admin.image || "/default-avatar.png"}
                  alt={admin.username}
                  className="w-12 h-12 object-cover rounded-lg mx-auto" />
              </td>
              <td className="p-2  text-left border">
                <div>
                  <div>{admin.username}</div>
                  <div className="text-gray-500  text-left text-xs">{admin.email}</div>
                </div>
              </td>
              <td className="p-2 border text-left">
                <div className="flex justify-center gap-3">
                  <Button
                    className={`!rounded-lg text-white px-4 py-1 ${
                      admin.isApproved ? "bg-green-400" : "bg-gray-400"
                    }`}
                    disabled={!currentUser?.isApproved} 
                    onClick={async () => {
                      if (!currentUser?.isApproved) return;
                      const result = window.confirm(
                        admin.isApproved
                          ? `Remove approval from ${admin.username}?`
                          : `Give approval to ${admin.username}?`
                      );

                      try {
                        await toggleApproval(admin._id, result);
                        toast.success(result ? "Approval Granted" : "Approval Removed");
                        fetchAdmins();
                      } catch (err) {
                        toast.error(err.message);
                      }
                    }}>
                    {admin.isApproved ? "Approved" : "Approved"}
                  </Button>


                  <Button
                    className="bg-gray-300 text-gray-700 hover:bg-gray-400  !rounded-lg"
                    onClick={() => router.push(`/admin/admins/${admin._id}`)}
                    color="default"
                    variant="flat" >
                    <Pencil size={16} />
                  </Button>

                  <Button
                    className="bg-red-400 text-white hover:bg-red-600 !rounded-lg"
                    color="danger"
                    variant="flat"
                    onClick={() => handleDelete(admin._id)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={approvalModal.open} onClose={() => setApprovalModal({ open: false })}>
        <ModalContent>
          <ModalHeader>Give Admin Access?</ModalHeader>
          <ModalBody>
            Are you sure you want to {approvalModal.currentStatus ? "remove" : "grant"} admin panel access?
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setApprovalModal({ open: false })}>Cancel</Button>
            <Button color="success"
              onPress={async () => {
                try {
                  await toggleApproval(approvalModal.userId, true);
                  toast.success("Approval Granted");
                  reloadData();
                } catch (e) { toast.error(e.message); }
                setApprovalModal({ open: false });
              }}>Yes</Button>
            <Button color="danger"
              onPress={async () => {
                try {
                  await toggleApproval(approvalModal.userId, false);
                  toast.success("Approval Removed");
                  reloadData();
                } catch (e) { toast.error(e.message); }
                setApprovalModal({ open: false });
              }}>No</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  );
}

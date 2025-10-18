
import ConnectDB from "../../utils/database";
import Contact from "../../../models/Contact";

export default async function AdminContactPage() {
  await ConnectDB();
  const Contacts = await Contact.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 text-left">
        Contact Messages
      </h1>

      {Contacts.length === 0 ? (
        <p className="text-center text-gray-500">No messages found.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border-collapse border border-gray-300 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3 text-left">Sr no</th>
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Email</th>
                <th className="border p-3 text-left">Phone</th>
                <th className="border p-3 text-left">Message</th>
                <th className="border p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {Contacts.map((c, index) => (
                <tr key={c._id} className="hover:bg-gray-50">
                 <td className=" border p-3">{index + 1}</td>
                  <td className="border p-3">{c.name}</td>
                  <td className="border p-3">{c.email}</td>
                  <td className="border p-3">{c.phone || "-"}</td>
                  <td className="border p-3">{c.message}</td>
                  <td className="border p-3">
                    {new Date(c.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

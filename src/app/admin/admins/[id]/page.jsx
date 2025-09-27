
import Form from "../components/Form";

export default async function EditAdminPage({ params }) {
   const { id } = await params;
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Admin</h1>
      <Form id={id} />
    </main>
  );
}

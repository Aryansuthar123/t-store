
import Form from "../components/Form";

export default async function EditAdminPage({ params }) {
   const { id } = await params;
  return (
    <main className="flex flex-col p-4 ">
      <Form id={id} />
    </main>
  );
}

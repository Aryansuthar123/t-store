// "use client";
// import Form from "./components/Form";
// import ListView from "./components/ListView";

// export default function page() {
//     return(
//         <main className="flex gap-5 flex-col md:flex-row  items-start p-2">
//             <Form />
//             <ListView />
//         </main>
//     )
// }

"use client";
import { useRouter } from "next/navigation";
import ListView from "./components/ListView";

export default function AdminListPage() {
  const router = useRouter();
  return (
    <main className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admins</h1>
        <button
          onClick={() => router.push("/admin/admins/create")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>
      <ListView />
    </main>
  );
}

import Link from "next/link";

export default function Page() {
    return(
        <main className="p-5">
            
            <div className="flex justify-center items-center gap-x-4">
                 <h1 className="text-xl ">Products</h1>
                 <Link href={`/admin/products/form`}>
                    <button className="bg-[#313131] text-sm text-white px-4 py-3 w-full rounded-lg">
                        Creater
                    </button>
                 </Link>
            </div>
        </main>
    );
}
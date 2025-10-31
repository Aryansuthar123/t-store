"use client";
import { Button } from "@nextui-org/react";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteProduct } from "../../../../lib/productService";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ListView() {
  const [pageLimit, setPageLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.products);
      })
      .catch((err) => console.error("Error fetching products:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / pageLimit);


  const startIndex = (currentPage - 1) * pageLimit;
  const displayedProducts = products.slice(startIndex, startIndex + pageLimit);

  return (
    <div className="min-h-screen w-[calc(100%+3rem)] -ml-12 -mt-10 p-3 bg-gray-50 rounded-lg">
      <div className="bg-white rounded-xl shadow-md p-1">
        <div className="flex justify-between items-center mb-4 mx-2 md:mx-0">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <Link href={`/admin/products/form`}>
            <button className="bg-pink-600 text-white px-3 py-1.5 !rounded-lg hover:bg-pink-700 transition">
              Create
            </button>
          </Link>
        </div>

        <div className="w-full overflow-x-auto">
         <div className="min-w-[90px]">
          <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border border-gray-300 px-3 py-2 text-left w-12">SN</th>
                <th className="border border-gray-300 px-3 py-2 text-left w-20">Image</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Title</th>
                <th className="border border-gray-300 px-3 py-2 text-left w-20">Price</th>
                <th className="border border-gray-300 px-3 py-2 text-left w-20">Stock</th>
             
                <th className="border border-gray-300 px-3 py-2 text-left w-28">Status</th>
                <th className="border border-gray-300 px-3 py-2 text-left w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedProducts.map((item, index) => (
                <Row key={item._id} products={item} index={index + (currentPage - 1) * pageLimit} />
              ))}
            </tbody>


          </table>
        </div>
        </div>

        <div className="flex justify-between items-center text-sm py-4">
          <Button
            size="sm"
            variant="bordered"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}>
            Previous
          </Button>

          <select
            value={pageLimit}
            onChange={(e) => {
              setPageLimit(Number(e.target.value))
              setCurrentPage(1);
            }}
            className="px-3 py-1 rounded-lg border border-gray-300">

            <option value={10}>10 Items</option>
            <option value={20}>20 Items</option>
            <option value={30}>30 Items</option>
            <option value={50}>50 Items</option>
          </select>

          <Button
            size="sm"
            variant="bordered"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(currentPage + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({ products, index }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    setIsDeleting(true);

    try {
      await deleteProduct(id);
      toast.success("Successfully Deleted");
      router.refresh();
    } catch (error) {
      toast.error(error?.message);
    }
    setIsDeleting(false);
  };

  const handleEdit = (id) => {
    router.push(`/admin/products/form?id=${id}`);
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="border border-gray-300 px-3  py-2 text-center">{index + 1}</td>

      <td className="border border-gray-300 px-3 py-2 text-center">
        <img
          src={products?.featureImage || products?.image || products?.images?.[0] || "/no-image.png"}
          alt={products?.title || "No name"}
          className="w-10 h-10 object-cover rounded mx-auto"
        />
      </td>

      <td className="border border-gray-300 px-3 py-2 font-medium whitespace-nowrap">
        {products?.title || "Untitled"}
      </td>

      <td className="border border-gray-300 px-3 py-2 font-medium">
        {products?.salePrice < products?.price && (
          <span className="text-xs text-gray-500 line-through mr-1">${products?.price || "-"}</span>
        )}
        ${products?.salePrice || "-"}
      </td>

      <td className="border border-gray-300 px-3 py-2 text-left">{products?.stock || "-"}</td>

     

      <td className="border border-gray-300 px-3 py-2 text-center">
        {products.stock - (products.orders || 0) > 0 ? (
          <div className="inline-block px-2 py-1 text-xs font-bold text-white bg-green-500 rounded-md">
            Available
          </div>
        ) : (
          <div className="inline-block px-2 py-1 text-xs font-bold text-white bg-red-400 rounded-md">
            Out of Stock
          </div>
        )}
      </td>

      <td className="border border-gray-300 px-3 py-2 text-center">
        <div className="flex justify-center gap-2">
          <Button
            onClick={() => handleEdit(products._id)}
            isDisabled={isDeleting}
            isIconOnly
            className="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
            <Pencil size={16} />
          </Button>

          <Button
            onClick={() => handleDelete(products._id)}
            isLoading={isDeleting}
            isDisabled={isDeleting}
            isIconOnly
            className="p-2 bg-red-600 text-white rounded hover:bg-red-700">

            <Trash2 size={16} />
          </Button>
        </div>
      </td>
    </tr>
  );
}

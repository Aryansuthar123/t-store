"use client";
import { Button } from "@nextui-org/react";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteProduct } from "../../../../lib/productService";
import { useRouter } from "next/navigation";


export default function ListView() {
  const [pageLimit, setPageLimit] = useState(3);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("Products from API:", data.products);
          setProducts(data.products);
        }
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (

    <div className="flex flex-col flex-1 md:pr-5 md:px-0 px-5 bg-white p-2 rounded-xl w-full overflow-x-auto  ">


      <table className="w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 font-semibold border-y px-3 py-2 bg-white text-left border w-24">SN</th>
            <th className="p-3 font-semibold border-y px-3 py-2 bg-white text-left border w-24">Image</th>
            <th className="p-3 font-semibold border-y px-3 py-2 bg-white text-left border w-24">Title</th>
            <th className="p-3 font-semibold border-y px-3 py-2 bg-white text-left border w-24">Price</th>
            <th className="p-3 font-semibold border-y px-3 py-2 bg-white text-left border w-24">Stock</th>
            <th className="p-3 font-semibold border-y px-3 py-2 bg-white text-left border w-24">Orders</th>
            <th className="p-3 font-semibold border-y px-3 py-2 bg-white text-left border w-24">Status</th>
            <th className="p-3 font-semibold border-y px-3 py-2 bg-white  text-left border w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, index) => {
            return (
              <Row products={item} index={index} key={item._id} />
            )
          }
          )}
        </tbody>
      </table>
      <div className= "flex  justify-between text-sm py-5">
        <Button size="sm" variant="bordered">
          Previous
        </Button>
        <select 
            value={pageLimit}
            onChange={(e) => setPageLimit(e.target.value)}
            className="px-5 rounded-xl" 
            name="perpage" id="perpage"
        >
          <option value={3}>3 Items</option>
          <option value={5}>5 Items</option>
          <option value={20}>20 Items</option>
          <option value={100}>100 Items</option>
          </select> 
        <Button size="sm" variant="bordered">Next</Button>
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
      fetchProducts();
    } catch (error) {
      toast.error(error?.message);
    }
    setIsDeleting(false)
  };


  const handleEdit = (id) => {
    router.push(`/admin/products/form?id=${products._id}`);

  };
  return (
    <tr key={products._id} className="text-center hover:bg-gray-50">
      <td className="p-2 border">{index + 1}</td>
      <td className="p-2 border">
        <img
          src={products?.featureImage || products?.image || products?.images?.[0] || "/no-image.png"}
          alt={products?.title || "No name"}
          className="w-10 h-10 object-cover rounded mx-auto"
        />
      </td>


      <td className="p-2 border font-medium whitespace-nowrap">{products?.title || "Untitled"}</td>
      <td className="p-2 border font-medium"> {
        products?.salePrice < products?.price && (
          <span className="text-xs text-gray-500 line-through ">$ {products?.price || "-"}</span>
        )} {" "} $ {products?.salePrice}</td>

      <td className="p-2 border font-medium">{products?.stock || "-"}</td>
      <td className="p-2 border font-medium">{products?.orders ?? 0}</td>
      <td className="p-2 border font-medium">
        <div className="flex">
          {products?.stock - (products?.orders ?? 0) > 0 &&
            <div className="px-3 py-2 text-xs text-white bg-green-500 font-bold rounded-md">Available</div>}
          {products?.stock - (products?.orders ?? 0) <= 0 &&
            <div className="px-3 py-2 text-xs text-white font-bold bg-red-400 rounded-md">Out of Stock
            </div>}
        </div>
      </td>
      <td className="p-2 flex justify-center border-r-lg gap-2 text-gray-600">
        <Button
          onClick={() => handleEdit(products._id)}
          isDisabled={isDeleting}
          isIconOnly
          className="p-2 bg-gray-200 rounded hover:bg-gray-300">
          <Pencil size={16} />
        </Button>
        <Button
          onClick={() => handleDelete(products._id)}
          isLoading={isDeleting}
          isDisabled={isDeleting}
          isIconOnly
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
          <Trash2 size={16} />
        </Button></td>
    </tr>
  )
}
"use client";
import { useEffect, useState } from "react";
import ProductBox from "../../components/ProductBox";

export default function RecentlyAdded() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.products.slice(0, 5));
      })
      .catch((err) => console.error("Fetch products error:", err));
  }, []);


  return (
    <section className="py-8 ">
      <h2 className="text-center text-8xl font-extrabold text-gray-900 mb-6">
        Recently Added Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2 max-w-6xl mx-auto">
        {products.map((item) => (
          <ProductBox key={item._id} product={item} />
        ))}
      </div>
    </section>
  );
}

"use client";
import { useEffect, useState } from "react";
import ProductBox from "../../components/ProductBox";

export default function FeaturedProduct() {
  const [products, setProducts] = useState([]);

  useEffect(() => {

    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {

          setProducts(data.products.slice(0, 5));
        }
      })
      .catch((err) => console.error("Fetch featured products error:", err));
  }, []);

  return (
    <section className="py-18 px-22">
      <h2 className="text-left text-3xl font-bold mb-6 text-gray-900">
        Feature Products
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3 max-w-7xl mx-auto">
        {products.map((item) => (
          <ProductBox key={item._id} product={item} />
        ))}
      </div>
    </section>
  );
}

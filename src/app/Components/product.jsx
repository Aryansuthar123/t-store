'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useProductContext } from "../context/ProductContext";
import toast from 'react-hot-toast';

export default function Product() {
  const { products } = useProductContext();
  const [localProducts, setLocalProducts] = useState(products || []);
  const [visibleCount, setVisibleCount] = useState(12);
  const [sortOrder, setSortOrder] = useState("")
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/products")
        ]);

        const catData = await catRes.json();
        const prodData = await prodRes.json();

        setCategories(catData?.data || catData?.categories || []);
        setLocalProducts(prodData?.data || prodData?.products || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.salePrice ?? a.price;
    const priceB = b.salePrice ?? b.price;

    if (sortOrder === "low") return priceA - priceB;
    if (sortOrder === "high") return priceB - priceA;

    return 0;
  });


  const filteredProducts =
    selectedCategory === "All"
      ? localProducts
      : localProducts.filter((p) => String(p.category) === selectedCategory);
  console.log('Selected Category:', selectedCategory);
  console.log('Filtered Products:', filteredProducts);

  const handleAddToCart = async (product) => {
    const cartItem = {
      _id: product._id,
      title: product.title,
      featureImage: product.featureImage || product.images?.[0] || "/placeholder.jpg",
      images: product.images || [],
      imgSrc: product.imgSrc || product.featureImage || product.images?.[0] || "/placeholder.jpg",
      price: product.price,
      salePrice: product.salePrice ?? null,
      description: product.description,
      quantity: 1,
    };

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItem),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Product added to cart!");
      } else {
        toast.error("You already added this product to the cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 12);
  };

  if (loading) {
    return <div className="text-center mt-10 text-lg text-gray-600">Loading...</div>;
  }
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">


      <aside className="md:col-span-1">
        <div className="bg-white rounded-2xl shadow p-5 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {selectedCategory === "All"
              ? "All Products"
              : categories.find((cat) => cat._id === selectedCategory)?.name || "Products"}
          </h2>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="mt-4">
            <label className="block text-sm text-gray-700 mb-1">Sort by Price</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Default</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>

        </div>
      </aside>


      <main className="md:col-span-3">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {selectedCategory === "All" ? "All Products" : selectedCategory}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedProductsProducts.length > 0 ? (
            sortedProductsProducts.slice(0, visibleCount).map((product) => (
              <div
                key={product._id}
                className="p-3 rounded-xl shadow-sm border border-gray-200 bg-white flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <Link href={`/store/product-details/${product._id}`}>
                  <img
                    src={
                      product.featureImage && product.featureImage.trim() !== ''
                        ? product.featureImage
                        : product.imgSrc || '/placeholder.jpg'
                    }
                    alt={product.title}
                    className="w-full h-[200px] object-contain rounded mb-3"
                  />
                </Link>

                <h3 className="font-bold text-lg">{product.title}</h3>
                <p
                  className="text-gray-600 text-sm flex-grow"
                  dangerouslySetInnerHTML={{ __html: product.description || '' }}
                />

                <div className="mt-2">
                  {product.salePrice ? (
                    <p>
                      <span className="text-gray-400 line-through mr-2">₹{product.price}</span>
                      <span className="text-green-600 font-semibold">₹{product.salePrice}</span>
                    </p>
                  ) : (
                    <p className="font-semibold">₹{product.price}</p>
                  )}
                </div>

                <button
                  className="mt-3 bg-pink-500 text-white px-4 py-2 rounded-xl hover:bg-pink-400 disabled:opacity-50"
                  onClick={() => handleAddToCart(product)}
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500">No products available</p>
          )}
        </div>

        {visibleCount < filteredProducts.length && (
          <div className="text-center mt-6">
            <button
              onClick={handleViewMore}
              className="px-5 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-500"
            >
              View More
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
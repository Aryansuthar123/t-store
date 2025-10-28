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
  const [priceRange, setPriceRange] = useState([0, 200000]);


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



  const filteredProducts = localProducts.filter((p) => {
    const price = p.salePrice ?? p.price;
    const inCategory =
      selectedCategory === "All" || String(p.category) === selectedCategory;
    const inPriceRange = price >= priceRange[0] && price <= priceRange[1];
    return inCategory && inPriceRange;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.salePrice ?? a.price;
    const priceB = b.salePrice ?? b.price;

    if (sortOrder === "low") return priceA - priceB;
    if (sortOrder === "high") return priceB - priceA;

    return 0;
  });

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

    <div className="max-w-7xl mx-auto py-3 px-11">

      <h1 className="text-3xl font-bold text-gray-800 mb-8">All Products</h1>
      <div className='flex flex-col md:flex-row md:items-start md:gap-5 '  >
        <aside className="md:col-span-1">
          <div className="bg-white rounded-2xl  shadow p-8 border px-10 border-gray-200">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Filter
            </h2>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="All">All Categors</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="mt-3">
              <label className="block text-xl text-gray-700 mb-2">Price Range</label>
              <div className="px-0">

                <input
                  type="range"
                  min="0"
                  max="200000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                  className="w-full accent-pink-500 mt-2" />

                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>₹{priceRange[0].toLocaleString()}</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="md:col-span-3 ">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sortedProducts.length > 0 ? (
              sortedProducts.slice(0, visibleCount).map((product) => (
                <div
                  key={product._id}
                  className="p-3 rounded-xl shadow-sm border border-gray-200 bg-white flex flex-col justify-between hover:shadow-md transition-shadow" >
                  <Link href={`/store/product-details/${product._id}`}>
                    <img
                      src={
                        product.featureImage && product.featureImage.trim() !== ''
                          ? product.featureImage
                          : product.imgSrc || '/placeholder.jpg'
                      }
                      alt={product.title}
                      className="w-full h-[200px] object-contain rounded mb-3" />
                  </Link>

                  <h3 className="font-bold text-lg">{product.title}</h3>
                  <p
                    className="text-gray-600 text-sm flex-grow"
                    dangerouslySetInnerHTML={{ __html: product.description || '' }} />

                  <div className="mt-2">
                    {product.salePrice ? (
                      <p>
                        <span className="text-gray-700 line-through mr-2">₹{product.price}</span>
                        <span className="text-green-600 font-semibold">₹{product.salePrice}</span>
                      </p>
                    ) : (
                      <p className="font-semibold">₹{product.price}</p>
                    )}
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      className="bg-pink-500 text-white px-3 py-1 hover:bg-pink-400 disabled:opacity-50 !rounded-lg w-1/2"
                      onClick={() => handleAddToCart(product)}
                      disabled={loading} >
                      {loading ? "Adding..." : "Add to Cart"}
                    </button>

                    <Link
                      href={`/store/product-details/${product._id}`}
                      className="bg-orange-400 text-white px-3 py-1 rounded-lg hover:bg-orange-300 text-center w-1/2 no-underline [text-decoration:none]"
                    >
                      View Product
                    </Link>

                  </div>

                </div>
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500">No products available</p>
            )}
          </div>

          {visibleCount < filteredProducts.length && (
            <div className="text-center mt-6 mb-10 ">
              <button
                onClick={handleViewMore}
                className="px-3 py-1 bg-gray-600 text-white shadow hover:bg-gray-500 !rounded-lg ">
                View More
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
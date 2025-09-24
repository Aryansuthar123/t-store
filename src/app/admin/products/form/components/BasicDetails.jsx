"use client";


import { useCategories } from "@/hooks/useCategories";


 export default function BasicDetails({data, handleData}) {
      const { data: categoryData, categories } = useCategories();
    return (
        <section className="flex flex-col flex-1   gap-2 bg-white  rounded-lg px-4 border">
            
            <h1 className="font-semibold text-xl">BasicDetails</h1>
            
            <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="product-title">
                    Product Name <span className="text-red-500">*</span>{""}
                </label>
                <input 
                    type="text"
                    placeholder="Enter Title"
                    id="product-title"
                    name="product-title"
                    value={data?.title ?? ""}
                    onChange={(e) => {
                        handleData("title", e.target.value);
                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none"/>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="product-short-description">
                    Sort Description <span className="text-red-500">*</span>{""}
                </label>
                <input 
                    type="text"
                    placeholder="Enter Short description"
                    id="product-short-description"
                    name="product-short-description"
                    value={data?.shortDescription ?? ""}
                    onChange={(e) => {
                        handleData("shortDescription", e.target.value);
                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none"/>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="product-category">
                    Category <span className="text-red-500">*</span>{""}
                </label>
                <select
                    type="text"
                    placeholder="Enter category"
                    id="product-category"
                    name="product-category"
                    value={data?.category ?? ""}
                    onChange={(e) => {
                        handleData("category", e.target.value);
                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none"
                     required>
                    <option value="">Setect Category</option>
                   {categories?.map((item, index) => {
                    return (
                        <option key={item?.id ?? `category-${index}` } value={item?.id ?? index} >
                            {item?.name}
                        </option>
                    )
                   })}
                </select>
            </div>

             <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="product-stock">
                    Stock <span className="text-red-500">*</span>{""}
                </label>
                <input 
                    type="number"
                    placeholder="Enter stock"
                    id="product-stock"
                    name="product-stock"
                    value={data?.stock ?? ""}
                    onChange={(e) => {
                        const val = e.target.value;
                         handleData("stock", val === "" ? "" : Number(val));
                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none" 
                    required/>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="product-price">
                    Price <span className="text-red-500">*</span>{""}
                </label>
                <input 
                    type="number"
                    placeholder="Enter Price"
                    id="product-price"
                    name="product-price"
                    value={data?.price ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                         handleData("price", val === "" ? "" : Number(val));
                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none"/>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-gray-500 text-xs" htmlFor="product-sale-price">
                    Sale price <span className="text-red-500">*</span>{""}
                </label>
                <input 
                    type="number"
                    placeholder="Enter Sale Price"
                    id="product-sale-price"
                    name="product-sale-price"
                    value={data?.salePrice ?? ""}
                    onChange={(e) => {
                         const val = e.target.value;
                         handleData("salePrice", val === "" ? "" : Number(val));
                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none"/>
            </div>
        </section>
    ) 
 }
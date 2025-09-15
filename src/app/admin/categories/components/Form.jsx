"use client";

export default function Form(){
    return (
        <div className="flex flex-col gap-3 bg-white rounded-xl p-5 ">
            <h1 className="font-semibold ">Create Categories</h1>
            <form>
                <div><label htmlFor="category-name">Name <span className="text-red-500">*</span>{" "}</label>
                    <input id="category-name"
                     name="category-name" 
                     type="text" 
                     placeholder="Enter Name" 
                    className="border px-4 py-2 rounded-lg w-full focus:outline-none"/>
                </div>
            </form>
           
        </div>
    );
}
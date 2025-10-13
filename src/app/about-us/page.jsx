"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function AboutUsPage() {
    const [abouts, setAbouts] = useState([]);
    const [activeTab, setActiveTab] = useState("Trending");

    useEffect(() => {
        fetch("/api/about")
            .then((res) => res.json())
            .then(setAbouts);
    }, []);

    return (
        <div className="px-25 py-10">
            <h2 className="text-2xl font-bold   mb-4">About T-Store</h2>
            <section className="w-full mb-12 flex flex-col lg:flex-row gap-10 items-start">
                <div className="w-full lg:w-[60%]">
                     <div className="w-full ">
                    <Image
                        src="/uploads/wt.png"
                        alt="T-Store Banner"
                        width={200}
                        height={100}
                        className="w-full h-auto"
                        priority
                    />
                </div>

                <div className="mt-6 text-left w-full">
                    <h1 className="text-2xl md:text-4xl font-bold mb-3">
                        Welcome to T-Store
                    </h1>
                    <p className="text-lg md:text-xl ">
                       We bring you the trendiest products crafted with top-notch quality and timeless design.
Every piece in our collection is carefully curated to suit your unique style and lifestyle — blending fashion, function, and sustainability.
From everyday essentials to statement pieces, we create products that not only look good but also make you feel confident and inspired.</p>
                </div>
            </div>
        <div className="w-full lg:w-[50%] flex flex-col gap-4">
          {[
            {
              img: "/uploads/d1.png",
              title:
                "T-Store introduces new offers this festive season!",
            },
            {
              img: "/uploads/d2.jpeg",
              title:
                "Discover sustainable fashion — crafted for comfort and style.",
            },
            {
              img: "/uploads/d3.jpeg",
              title:
                "Meet the creative team behind T-Store’s latest collection.",
            },
            {
              img: "/uploads/d4.jpeg",
              title:
                "Customer stories: how T-Store is redefining shopping.",
            },
          ].map((story, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white rounded-md p-3 border hover:shadow-md transition"
            >
              <Image
                src={story.img}
                alt={story.title}
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-md flex-shrink-0"
              />
              <p className="text-sm font-medium text-gray-800 leading-snug">
                {story.title}
              </p>
            </div>
          ))}
        </div>
            </section>


            

            <div className="flex gap-9 border-b border-gray-200 mb-6 relative">
                {["Trending", "MeetUs"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative px-2 pb-2 font-medium   text-sm  transition-colors duration-300 ${activeTab === tab ? "text-black" : "text-gray-500"
                            }`}>
                        {tab === "Trending" ? "Trending Now" : "Meet Us"}
                        {activeTab === tab && (
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-[2px] bg-orange-500 rounded transition-all duration-300"></span>
                        )}
                    </button>
                ))}
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {abouts.filter((item) => item.category === activeTab).map((item) => (
                    <div
                        key={item._id}
                        className="bg-white rounded-lg shadow hover:shadow-md overflow-hidden transition-shadow duration-300">

                        <div className="w-full aspect-[16/9] overflow-hidden rounded-lg">
                            <Image
                                src={item.image}
                                alt={item.title}
                                width={400}
                                height={250}
                                className="w-full h-full object-contain rounded-t-lg" />
                        </div>
                        <div className="p-4">
                            <h4 className="font-semibold mb-2">{item.title}</h4>
                            <p className="text-gray-600 text-sm line-clamp-4">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

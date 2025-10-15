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

  const topSection = abouts.find((item) => item.category === "top");
  const topStories = abouts.filter((item) => item.category === "TopStories");

  return (
    <div className="px-15 sm:px-10 md:px-20 py-10">
      <h2 className="text-2xl px-3 font-bold mb-8 text-left">About T-Store</h2>

      {(topSection || topStories) && (
        <div className="grid grid-cols-1  md:grid-cols-2 gap-6 mb-12">

          {topSection && (
            <div className="flex flex-col items-center gap-5">
              <div className="w-full flex px-3 justify-center">
                {topSection.image?.startsWith("/") ? (
                  <Image
                    src={topSection.image}
                    alt={topSection.title}
                    width={950}
                    height={650}
                    className="rounded-lg shadow-md object-contain" />
                ) : (
                  <div className="w-full h-[350px] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    No image available
                  </div>
                )}
              </div>
              <div className="w-full  px-3 text-left">
                <h3 className="text-2xl  font-semibold mb-3">{topSection.title}</h3>
                <p className="text-gray-700 text-base leading-relaxed">{topSection.description}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 px-3">
            {Array.isArray(topStories) && topStories.slice(0, 4).map((story) => (
              <div key={story._id} className="flex items-start gap-3 ">
                <Image
                  src={story.image}
                  alt={story.title}
                  width={150}
                  height={150}
                  className="rounded-lg shadow-md object-contain flex-shrink-0" />
                <h3 className="text-gray-400 text-base leading-relaxed line-clamp-2">{story.title}</h3>
              </div>
            ))}

          </div>
        </div>
      )}


      <div className="flex gap-9 border-b border-gray-200 px-1 mb-6 relative">
        {["Trending", "MeetUs"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-2 pb-2 font-medium text-sm transition-colors duration-300 ${activeTab === tab ? "text-black" : "text-gray-500"
              }`} >
            {tab === "Trending" ? "Trending Now" : "Meet Us"}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-[2px] bg-orange-500 rounded transition-all duration-300"></span>
            )}
          </button>
        ))}
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 px-2 lg:grid-cols-4 gap-6">
        {abouts
          .filter((item) => item.category === activeTab)
          .map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow hover:shadow-md overflow-hidden transition-shadow duration-300" >
              <div className="w-full aspect-[16/9] overflow-hidden rounded-lg">
                {item.image?.startsWith("/") ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={250}
                    className="w-full h-full object-contain rounded-t-lg" />
                ) : (
                  <div className="w-full h-[250px] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    No image
                  </div>
                )}
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

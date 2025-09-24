"use client";
export default function Images({ data, setFeatureImage, featureImage ,imageList, setImageList}) {
    return (
        <section className="flex-1 flex flex-col gap-2 bg-white  rounded-lg px-4 border">
            <h1 className="font-semibold text-xs">Images</h1>
            <div className="flex flex-col gap-1">
                {featureImage && <div className="flex justify-center">
                    <img 

                    className="h-20 object-cover rounded-lg" 
                    src={URL.createObjectURL(featureImage)} 
                    alt=""/>
                    </div>}
                <label
                 className="text-gray-500 text-xs" htmlFor="product-feature-image">
                    Feature Image <span className="text-red-500">*</span>{""}
                </label>

                <input
                    type="file"
                    id="product-feature-image"
                    name="product-feature-image"
                    onChange={(e) => {
                        if (e.target.files.length > 0){
                            setFeatureImage(e.target.files[0]);
                        }
                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none" />
            </div>

            <div className="flex flex-col gap-1">
                    {imageList?.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                            {imageList?.map((item, index) => {
                                return(
                                <img 
                                    key={index}
                                    className="w-20 object-cover rounded-lg" 
                                    src={URL.createObjectURL(item)} 
                                    alt=""/>
                                );
                            })}
                        </div>
                    )}
                <label className="text-gray-500 text-xs" htmlFor="product-images">
                     Images <span className="text-red-500">*</span>{""}
                </label>

                <input
                    type="file"
                    id="product-images"
                    name="product-images"
                    multiple
                    onChange={(e) => {
                        const newFiles = [];
                        for(let i = 0 ; i < e.target.files.length; i++) {
                            newFiles.push(e.target.files[i]);
                        }
                        setImageList((prev) => [...prev, ...newFiles]);

                    }}
                    className="border px-4 py-2 rounded-lg w-full outline-none" />
            </div>
        </section>
    )
} 
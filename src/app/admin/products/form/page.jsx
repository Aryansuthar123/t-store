"use client"
import { useEffect, useState } from "react";
import BasicDetails from "./components/BasicDetails";
import Images from "./components/Images"
import Description from "./components/Description"
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import { getProduct, createNewProduct, updateProduct } from "@/lib/productService";

import { useSearchParams } from "next/navigation";

export default function Page() {
    const [data, setData] = useState(null);
    const [featureImage, setFeatureImage] = useState(null);
    const [imageList, setImageList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const fetchData = async () => {
        try {
            const res = await getProduct(id);
            if (!res) {
                throw new Error("Product Not found");
            } else {
                setData(res);
            }
        } catch (error) {
            toast.error(error?.message);
        }
    }

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id])
    const handleData = (key, value) => {
        setData((prevData) => {
            return {
                ...(prevData ?? {}),
                [key]: value,
            };
        });
    };

    const handelSubmit = async () => {
        setIsLoading(true);
        try {
            if (id) {
                
                await updateProduct(id, {
                    ...data,
                    featureImage,
                    images: imageList,
                });
                toast.success("Product is successfully updated!");
            } else {
               
                await createNewProduct({
                    ...data,
                    featureImage,
                    images: imageList,
                });
                toast.success("Product is successfully created!");
            }

          
            setData(null);
            setFeatureImage(null);
            setImageList([]);
        } catch (error) {
            console.log(error?.message);
            toast.error(error?.message);
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            handelSubmit();
        }}

            className="text-xl font-semibold flex flex-col gap-1 p-1 px-1 py-1">
            <div className="flex justify-between w-full">
                <h1 className="font-semibold">{id ? "Edit Product" : "Create new Product"}</h1>
                <Button isLoading={isLoading} isDisabled={isLoading} type="submit">{id ? "Update" : "Create"}</Button>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
                <BasicDetails data={data} handleData={handleData} className="flex-1 max-w-md" />
                <div className="flex flex-1 flex-col gap-2">
                    <Images
                        data={data}
                        featureImage={featureImage}
                        setFeatureImage={setFeatureImage}
                        imageList={imageList}
                        setImageList={setImageList}
                        className="flex-1 max-w-md" />
                    <Description data={data} handleData={handleData} className="flex-1 max-w-md" />
                </div>
            </div>
        </form>
    );
}
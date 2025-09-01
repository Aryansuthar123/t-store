
import { getProducts } from '@/library';
import ProductBox from "@/components/ProductBox"
import React from "react";

export default function Storepage() 
{
        return(
            <ProductListing/> 
        )
}
 
     

const ProductListing = async () => {
        const  data = await getProducts();
        return  <div className='col-span-4 grid grid-cols-3 gap-2 mt-3'>
                {
                        data.map(
                                (d) =>  <ProductBox product={d} key={"product-" + d.id}/>
                        )
                }
            
        </div>             
}
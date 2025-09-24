'use client'
import React  from 'react';
import Product from '../Components/product';
import  {useProductContext} from '../context/ProductContext'

const page = () => {
    const {products} = useProductContext();
   
    return (
        <div><Product items={products}/>
        </div>
    )
}


export default page;
'use client'
import React  from 'react';
import Product from '../Components/product';
import  {useProductContext} from '../context/ProductContext'

const page = () => {
    const {data} = useProductContext();
    // console.log("context hook = ", useProductContext())
    return (
        <div><Product items={data}/></div>
    )
}


export default page;
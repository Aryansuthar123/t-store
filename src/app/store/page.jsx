'use client'
import React  from 'react';
import Product from '../Components/product';
import  {useProductContext} from '../context/ProductContext'

const StorePage = () => {
    const {products} = useProductContext();
   
    return (
        <div><Product items={products}/>
        </div>
    )
}


export default StorePage;
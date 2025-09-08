import { response } from "express"

const getCategories = async () => {
    const response = await fetch('https://fakestoreapi.in/api/products/category');
    const data = await response.json();
    return data.categories; 
}


const getProducts = async () => {
    const response= await fetch('https://fakestoreapi.in/api/products');
   
 
    const data = await response.json();
    return data.products; 
}

export {getCategories}
// import { response } from "express"

const getCategories = async () => {
    const response = await fetch('https://fakestoreapi.in/api/products/category');
    const data = await response.json();
    return data.categories; 
}


const getProducts = async (products_id = null) => {
    let API = 'https://fakestoreapi.in/api/products'
    if(products_id =! null){
        API += "/" + products_id;
    }
    const response = await fetch(API);
    const data = await response.json();
    return data.products; 
}

export {getCategories, getProducts}
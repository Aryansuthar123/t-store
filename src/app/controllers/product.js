import Product from "../models/product";
import { NextResponse } from "next/server";

// add product
export const createProduct  = async (req) => {
        const body = await req.json();                                                                                                                                                                                                                                       
        const newProduct = await Product.create(body);

  return NextResponse.json({
    message:"Product added Successfully..!",
    newProduct,
  });
};    

// get all products
export const getProducts = async (req) => {
  const product = await Product.find();
  return NextResponse.json({
    message: "All product Fetched..!", success: true, product,
  });
};
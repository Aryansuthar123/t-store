import connectDB from "../../utils/database";
import {createProduct, getProducts} from "../../controllers/product"

// http://localhost:3000/api/products
export async function POST(req){
    await connectDB();
    return createProduct(req);
}
// http://localhost:3000/api/products
export async function GET(req) {
    await connectDB(); 
    return getProducts();
}


// import { serve } from "inngest/next";
// import { inngest, syncUserCreation, syncUserUpdation, syncUserDeletion } from "@/Config/inngest";

// // Create an API that serves zero functions
// export const { GET, POST, PUT } = serve({
//   client: inngest,
//   functions: [
//      syncUserCreation, 
//      syncUserUpdation, 
//      syncUserDeletion
//   ],
// });
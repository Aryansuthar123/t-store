import mongoose from "mongoose"
import { NextRequest } from "next/server";

const connectDB = async () => {
    if (mongoose.connection.readyState) {
        console.log("Already MongoDB  Connected..!");
        return;
    }


    mongoose.connect(
        "mongodb+srv://aryansuthar222_db_user:vD6hjPFTrDFeuL9I@cluster0.pba8a0n.mongodb.net/",
        {dbName: "Next_js_Ecommerce",}
    ).then((msg) => console.log("Mongosdb Connected Successfully...!")).catch((err) => console.log
        (err.message));
};

export default  connectDB;
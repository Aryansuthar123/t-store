 // import { CartIcon } from "@/assets/assets";
import { verify } from "crypto";
import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";
import { type } from "os";
// import { unique } from "next/dist/build/utils";


const userSchema  = new mongoose.Schema({
    username: {
        type: String,
        required : [true, "Please provide a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide a Email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide a Password"],
    },
    isVerfied: {
        type: Boolean,
        default: false,
    },
    isAdmin : {
        type: Boolean,
        default: false,
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken:String,
    verifyTokenExpiry: Date,
})

const User = mongoose.models.user || mongoose.model('users', userSchema);

export default User; 
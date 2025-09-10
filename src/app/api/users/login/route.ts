import connectDB from "../../../utils/database";
import User from "../../../../models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';
connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { email, password } = reqBody
        console.log(reqBody);

        //chack if user exist
        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        //chack if  password is correct
        const validPassword = await bcryptjs.compare(password, user.password)

        //create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,
        }

        //create token
        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})
        const response =  NextResponse.json({
            message: "Login seccessfully",
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true,
        })
        return response;
        
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })

    }

}
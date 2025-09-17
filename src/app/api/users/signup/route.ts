import connectDB from "../../../utils/database";
import User from "../../../../models/userModel";
import  {NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { username, email, password } = reqBody
        console.log(reqBody);

        //check if user alredy exists
        const user = await User.findOne({ email })
        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 })
        }

        //hash password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)


        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            isAdmin: false,   
            role: "user"  
        })
        
        const savedUser = await newUser.save()
        console.log(savedUser);

        return NextResponse.json({
            message : "User created Successfully",
            success: true,
            savedUser
        })


    } catch (error: any) {
        return NextResponse.json({ error: error.message },
            { status: 500 })
    }

}
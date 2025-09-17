    import { NextResponse } from "next/server";

    export async function POST() {
    try {
        const response = NextResponse.json({
        success: true,
        message: "Logged out successfully",
        });

    
        response.cookies.set("token", "", {
        httpOnly: true,
        expires: new Date(0),
        });

        return response;
    } catch (error: any) {
        return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
        );
    }
    }

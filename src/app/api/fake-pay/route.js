
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
   
    const paymentId = `fake_pay_${Date.now()}`;
    const response = {
      success: true,
      paymentId,
      amount: body.amount,
      method: body.method || "card",
      message: "Payment simulated (no money transferred).",
    };
    
    await new Promise((res) => setTimeout(res, 800));
    return NextResponse.json(response);
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

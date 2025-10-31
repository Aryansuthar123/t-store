import ConnectDB from "../../utils/database";
import Contact from "../../../models/Contact";

// 🟢 GET → fetch all contact messages
export async function GET() {
  try {
    await ConnectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 });

    return new Response(
      JSON.stringify({ success: true, contacts }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("GET /api/contact error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Failed to fetch contacts" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// 🟣 POST → save new contact message
export async function POST(req) {
  try {
    const { name, email, phone, message } = await req.json();
    await ConnectDB();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ success: false, message: "Please fill all required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await Contact.create({ name, email, phone, message });

    return new Response(
      JSON.stringify({ success: true, message: "Message submitted successfully" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("POST /api/contact error:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Something went wrong" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
